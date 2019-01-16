import React, { Component } from 'react';
import './Customize.less';
import PropTypes from "prop-types";
import { message, Modal, Input, Dropdown, Popover, Icon, Menu, InputNumber } from 'antd';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import _sum from 'lodash/sum';
import { MouseEventTool, CompBaseClass } from "@/utils/BaseTools.js";
import CompGenerater from '@/components/modules/CompGenerater';
import config_mod from '@/components/modules/Config.js';
import {searchCodelist} from '@/components/lists/KeyBoardOrigin';
import { KeyCode } from '@/components/lists/otherConfig';

class Oper extends CompBaseClass{
  constructor(props){
    super(props);
    this.onFocusHandle = this.onFocusHandle.bind(this);
    this.onBlurHandle = this.onBlurHandle.bind(this);
    this.onInputChangeHandle = this.onInputChangeHandle.bind(this);
    this.updateSelect = this.updateSelect.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.select = 0;
    this.state = {
      searchPanel: [],
      value: ''
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  updateSelect(index){
    // 上下键选择搜索结果
    if(index !== this.select && index >= 0 && index + 1 <= this.state.searchPanel.length){
      this.select = index;
      this.$(`#${this.compId} .select`).forEach(ele => ele.classList.remove('select'));
      this.$(`#${this.compId} .searchItem`)[index].classList.add('select');
    }
  }

  onKeyPress(e){
    console.log(e.keyCode);
    switch(e.keyCode){
      case KeyCode.UP:
        this.updateSelect(this.select - 1);
        break;
      case KeyCode.DOWN:
        this.updateSelect(this.select + 1);
        break;
      case KeyCode.ENTER:
        let data = window.codelist.data[this.state.searchPanel[this.select]];
        this.props.onClickHandler({e, index: this.props.index, data, type: 'searchSelect'});
        this.setState({searchPanel: [], value: data.stockCode});
        break;
    }
  }

  onFocusHandle(e){
    document.addEventListener('keydown', this.onKeyPress);
    window.canKeyBoard = false;
    this.setState({searchPanel: searchCodelist(e.target.value, 8)});
  }

  onBlurHandle(e){
    document.removeEventListener('keydown', this.onKeyPress);
    window.canKeyBoard = true;
    setTimeout(_ => this.setState({searchPanel: []}), 250);
  }

  onInputChangeHandle(e){
    this.select = 0;
    this.setState({value: e.target.value, searchPanel: searchCodelist(e.target.value, 8)});
  }

  render(){
    const {compConfig, config, globalMoveable, startHandle, subCompId, onClickHandler, index, actionNameByGroup} = this.props;
    const self = this;
    const groupPop = (
      <div className="groupBox">
        <div className="groupTitle">选择分组</div>
        {
          actionNameByGroup.map((item, subIndex) => (
            <span
              key={index}
              className="groupItem"
              onClick={e => onClickHandler({e, index, data: subIndex, type: 'groupSelect'})}
            >
              {subIndex + 1}
            </span>
          ))
        }
      </div>
    );
    let getCompSearch = () => {
      let symbol;
      if(compConfig.symbol){
        symbol = compConfig.symbol;
      }else if(actionNameByGroup[config.groupId] !== ''){
        symbol = actionNameByGroup[config.groupId];
        this.state.value = symbol.split('.')[1];
      }else{
        symbol = config_mod[compConfig.name].actionName.split('-')[0];
      }
      let stockInfo = window.codelist.data[symbol];
      let tmp = this.state.searchPanel.findIndex(key => window.codelist.data[key].uuid === stockInfo.uuid);
      tmp > -1 && (this.select = tmp);
      return (
        <div
          className="compSearch"
          id={this.compId}
        >
          <Input
            addonAfter={stockInfo.stockName}
            size="small"
            ref={node => this.inputNode = node}
            onChange={e => this.onInputChangeHandle(e)}
            onFocus={this.onFocusHandle}
            onBlur={this.onBlurHandle}
            value={[self.state.value, stockInfo.stockCode][Number(self.state.value === '')]}
          />
          <div className="searchPanel">
            {
              this.state.searchPanel.map((key, subIndex) => {
                let data = window.codelist.data[key], isNotDel;
                return (
                  <div
                    className={`searchItem ${subIndex === this.select && 'select' || ''}`}
                    key={subIndex}
                    onClick={e => {onClickHandler({e, index, data, type: 'searchSelect'}); this.setState({value: data.stockCode})}}
                  >
                    <div className="stockCode" title={data.stockCode} >{data.stockCode}</div>
                    <div className="stockName" title={data.stockName} >{data.stockName}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )
    };
    return (
      <div
        data-type={`${subCompId}-title`}
        onMouseDown={e => globalMoveable && config.moveable && startHandle(e)}
        className="pluginTitle">
        <div className="operLeft">
          {config.titleName}
        </div>
        <div className="operRight">
          { config.hasSearch && getCompSearch() }
          {
            config.hasGroup &&
              <Popover
                placement="bottomLeft"
                title={null}
                content={groupPop}
                trigger="hover"
                overlayClassName="popoverBox"
              >
                <div className="groupId" data-val={config.groupId}>
                  {config.groupId + 1}
                </div>
              </Popover>
          }
          { config.hasSetting && <Icon type="setting"/> }
          { config.hasClose && <Icon type="close-square" onClick={e => onClickHandler({e, type: 'close', id: subCompId, index})}/> }
        </div>
      </div>
    )
  }
}

Oper.propTypes = {
  config: PropTypes.object.isRequired,
  globalMoveable: PropTypes.bool,
  startHandle: PropTypes.func,
  subCompId: PropTypes.string,
  onClickHandler: PropTypes.func,
  index: PropTypes.number,
  actionNameByGroup: PropTypes.array
}

Oper.defaultProps = {
  startHandle: _ => _,
}


class Customize extends MouseEventTool{
  constructor(props){
    super(props);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.lastMountComp = undefined;
    this.times = 0;
    this.customizeItemSample = {
      comps: [],
      compNum: 0,
    }
    // 全局控制组件是否可拖动
    this.globalMoveable = true;
    // 全局控制组件是否可调整宽高
    this.globalResizable = true;
    // 分组数量
    this.maxGroup = 8;
    // 支持分组的组件列表
    this.state = {
      // bar配置
      globalComp: {comps: []},
      customize: [{comps: []}],
      maxShowNum: 10,
      index: 0,
      boxWidth: 0,    // 面板宽
      boxHeight: 0,   // 面板高
      operInfo: {},   // 移动或改变大小组件的信息
      actionNameByGroup: (new Array(this.maxGroup)).fill(''), // 分组下的actionName
    }
    this.globalComp = _cloneDeep(this.customizeItemSample);
    this.customize = [_cloneDeep(this.customizeItemSample)];
    this.state.barConfig = [ {name: '综合盯盘', setItem: ['edit', 'rename', 'delete']} ];
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  updateSelect(e, compId, index){
    let ele;
    [...document.querySelectorAll('.changeOrigin .selected'), ...document.querySelectorAll('.TableOrigin .selected')].forEach(ele => {
      ele.classList.remove('selected');
    })
    if(compId){
      (ele = document.querySelectorAll(`#${compId} .TbodyInner .brief tr`), ele.length > index && ele[index].classList.add('selected'));
      (ele = document.querySelectorAll(`#${compId} .TbodyInner .detailOuter tr`), ele.length > index && ele[index].classList.add('selected'));
    }else{
      e.currentTarget.classList.add('selected');
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  loadGlobalComp(){
    // 加载全局组件
    this.loadPluginPath('CompPanel', {
      props: {
        style: {
          top: '50px',
          right: '20px',
          zIndex: 5,
          height: '3.5rem'
        }
      },
      config: {
        titleName: '选择组件',
        hasSetting: false,
        hasGroup: false
      },
      type: 'global',
      subProps: {
      }
    });
  }

  componentDidMount(){
    let self = this;
    let { clientWidth: boxWidth, clientHeight: boxHeight } = document.querySelector('.customize .mainBox');
    this.setState({boxWidth, boxHeight});
    this.init();
    this.globalComp.comps.length === 0 && (this.loadGlobalComp());
    window.addEventListener('resize', this.onWindowResize);
  }

  init(){
    // 尝试从缓存中读取之前保存的配置信息
    let config = localStorage.getItem('customize:config');
    config && (config = JSON.parse(config)) || (config = undefined);
    let tmpGlobalComp, tmpLocalComp, tmpGlobalNum, tmpLocalNum, maxTmpLocalNum = 0;
    if(config){
      if(config.barConfig){
        this.globalComp = config.globalComp;
        tmpGlobalNum = 0;
        tmpGlobalComp = new Array(config.globalComp.comps.length).fill('');
        config.globalComp.comps.forEach(async (item, index) => {
          let mod = await this.loadPluginPath(item.name);
          tmpGlobalComp[index] = mod;
          ++tmpGlobalNum;
          if(tmpGlobalNum === tmpGlobalComp.length){
            this.setState({globalComp: {comps: tmpGlobalComp}});
          }
        })
      }
      if(config.customize){
        this.customize = config.customize;
        tmpLocalComp = new Array(config.customize.length).fill('');
        tmpLocalNum = new Array(config.customize.length).fill(0);
        config.customize.forEach((item, index) => {
          tmpLocalComp[index] = new Array(item.comps.lnegth).fill('');
          maxTmpLocalNum += item.comps.length;
          item.comps.forEach(async (subItem, subIndex) => {
            let mod = await this.loadPluginPath(subItem.name);
            tmpLocalComp[index][subIndex] = mod;
            ++tmpLocalNum[index];
            if(_sum(tmpLocalNum) === maxTmpLocalNum){
              this.setState({
                customize: Array.from(tmpLocalComp, item => ({comps: item})),
                barConfig: config.barConfig
              });
            }
          })
        })
      }
    }
  }

  updateSetting(name, setting, Comp){
    /* ********************
     * 用于将加载的组件放进组件仓库
     * params:
     *   @name: 文件名或者组件名
     *   @setting: 配置信息
     *   @Comp: 组件或组件生成器
     * ********************/
    let newSetting = _merge({
      props: {
        style: {
          width: '3rem',
          height: '4rem',
          overflow: 'hidden',
          zIndex: 1
        },
      },
      type: 'local',
      subProps: {
      },
      config: {
        resizable: true,
        moveable: true,
        hasClose: true,
        hasSetting: false,
        hasGroup: false,
        groupMaster: false,
        hasSearch: false,
        titleName: '组件名',
        groupId: 0
      },
    }, setting);
    this.setState(prev => {
      this.lastMountComp = {...newSetting.config};
      if(newSetting.type !== 'global'){
        this.customize[prev.index].comps.push({ name, ...newSetting });
        prev.customize[prev.index].comps.push(Comp);
      }else{
        this.globalComp.comps.push({name, ...newSetting});
        prev.globalComp.comps.push(Comp);
      }
      return prev;
    })
  }

  async loadPluginPath(name, setting){
    /* *****************
     * 动态加载模块
     * this.loadPluginPath(name, setting)
     *   name: 模块名
     *   setting: 配置项, 可选, 不传时返回Promise对象
     * ****************/
    let Comp;
    if(config_mod[name]){
      Comp = CompGenerater;
    }else{
      let mod = await import(`@/components/modules/${name}`);
      Comp = mod.default;
    }
    setting && this.updateSetting(name, setting, Comp);
    return Comp;
  }

  getAttribute(e){
    /* *****************
     * 用于元素拖动及移动操作
     * 传入事件, 返回新的配置信息
     * ****************/
    e.stopPropagation();
    let [tarEleId, tmpType] = e.currentTarget.getAttribute("data-type").split('-');
    let tmpObj = {
      tarEleId,
      tarEle: this.$(`#${tarEleId}`),
      type: tmpType,
    };
    switch(tmpObj.type){
      case 'title':
        tmpObj.operType = 'move';
        tmpObj.config = [{
          main: 'left',
          maxData: this.$('.mainBox')[0].scrollWidth - tmpObj.tarEle[0].scrollWidth,
          minData: 0
        }, {
          main: 'top',
          maxData: this.$('.mainBox')[0].scrollHeight - tmpObj.tarEle[0].scrollHeight,
          minData: 0
        }];
        break;
      default:
        tmpObj.operType = `resize-${tmpObj.type}`;
        tmpObj.config = [{
          main: 'width',
          maxData: 800,
          minData: 50
        }, {
          main: 'height',
          maxData: 600,
          minData: 50
        }, {
          main: 'left',
          maxData: (data, config, main) => data.width >= config[0].maxData || data.width <= config[0].minData? -1: data.left,
          minData: 0
        }, {
          main: 'top',
          maxData: (data, config, main) => data.height >= config[1].maxData || data.height <= config[1].minData? -1: data.top,
          minData: 0
        }];
    }
    let self = this;
    tmpObj.startCallBack = info => {
      this.mouseStartInfo.goingFlag = false;
      if(info.tarEleId.split('_')[2] !== 'local')return;
      info.tarEle.forEach(ele => self.updateZindex(ele));
    }
    tmpObj.endCallBack = info => {
      if(this.mouseStartInfo.goingFlag === false)return ;
      let [cmpName, index, type] = info.tarEleId.split('_'), style;
      index = parseInt(index);
      console.log(this.state, tmpObj);
      if(type === 'global'){
        style = _cloneDeep(this.globalComp.comps[index].props.style);
        info.config.forEach(item => style[item.main] = info['new_' + item.main]);// / 100 + 'rem');
        this.globalComp.comps[index].props.style = style;
      }else if(type === 'local'){
        style = _cloneDeep(self.customize[self.state.index].comps[index].props.style);
        info.config.forEach(item => style[item.main] = info['new_' + item.main]);// / 100 + 'rem');
        self.customize[self.state.index].comps[index].props.style = style;
      }
    }
    return tmpObj;
  }

  componentDidUpdate(prevProps){
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize(){
    let now = Date.now();
    if(now > this.times)this.times = now
    setTimeout(() => {
      if(now === this.times){
        this.setState(prevState => {
          let { clientWidth: boxWidth, clientHeight: boxHeight } = document.querySelector('.customize .mainBox');
          for (var e = document.querySelectorAll(`.customize .subComp`), t = 0, n = e.length; t < n; t++){
            if(e[t].offsetLeft + e[t].offsetWidth > boxWidth){
              let left = boxWidth - e[t].offsetWidth;
              left < 0 && (left = 0);
              e[t].style.left = `${left}px`;
            }
            if(e[t].offsetTop + e[t].offsetHeight > boxHeight){
              let top = boxHeight - e[t].offsetHeight;
              top < 0 && (top = 0);
              e[t].style.top = `${top}px`;
            }
          }
          return {...prevState, boxWidth, boxHeight};
        });
      }
    }, 50);
  }

  updateZindex(ele){
    this.customize[this.state.index].comps.forEach(item => {
      document.getElementById(item.id).style.zIndex = 1;
    })
    ele.style.zIndex = 2;
  }

  onClickHandler({e, type, index, id, data, setting, name}){
    e && e.stopPropagation && e.stopPropagation()
    let self = this;
    switch(type){
      case 'save':
        localStorage.setItem('customize:config', JSON.stringify({
          globalComp: this.globalComp,
          customize: this.customize,
          barConfig: this.state.barConfig
        }));
        message.info('当前配置保存成功');
        break;
      case 'add':
        // 添加标签页
        this.setState(prev => {
          let barIndex = prev.barConfig[prev.barConfig.length - 1].barIndex || 0;
          prev.barConfig.push({name: `自定义${barIndex + 1}`, barIndex: barIndex + 1, setItem: ['edit', 'rename', 'delete']})
          prev.customize.push({comps: []});
          this.customize.push(_cloneDeep(this.customizeItemSample));
          prev.index = prev.barConfig.length - 1;
          prev.index = prev.barConfig.length - 1;
          return prev
        })
        break;
      case 'edit':
        // 显示插件工具栏
        document.getElementById('CompPanel_0_global').style.display = 'block';
        break;
      case 'rename':
        // 改名
        window.canKeyBoard = false;
        Modal.confirm({
          title: '修改名称',
          okText: '修改',
          cancelText: '取消',
          content: (
            <Input
              placeholder="请输入盯盘名"
              defaultValue={this.state.barConfig[index].name}
              ref={node => this.updateNameInput = node}
            />
          ),
          onOk() {
            self.setState(prev => {
              prev.barConfig[index].name = self.updateNameInput.input.value;
              return prev;
            })
          },
          onCancel() {
          },
          afterClose() {
            window.canKeyBoard = true;
          }
        })
        break;
      case 'delete':
        // 删除
        if(this.state.barConfig.length === 1){
          message.info('只有一个盯盘不能删除');
          return;
        }
        Modal.confirm({
          title: '删除面板',
          content: '删除后将无法找回, 确定要删除该面板嘛?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            self.setState(prev => {
              prev.index <= index && prev.index && (--prev.index);
              prev.barConfig.splice(index, 1);
              prev.customize.splice(index, 1);
              self.customize.splice(index, 1);
              return prev
            })
          },
          onCancel() {
          },
        });
        break;
      case 'ok':
        // 组件面板确定按钮点击事件
        break;
      case 'no':
        // 组件面板取消按钮点击事件
        document.getElementById('CompPanel_0_global').style.display = 'none';
        break;
      case 'select':
        this.setState(prev => {
          prev.index = index;
          return prev;
        });
        break;
      case 'close':
        [name, , type] = id.split('_');
        if(type === 'global'){
          document.getElementById(id).style.display = 'none';
        }else{
          this.setState(prev => {
            prev.customize[prev.index].comps.splice(index, 1);
            this.customize[prev.index].comps.splice(index, 1);
            return prev;
          })
        }
        break;
      case 'loadplugin':
        let customizeItem = this.customize[this.state.index];
        if(customizeItem.compNum >= this.state.maxShowNum){
          message.info(`盯盘最多显示${this.state.maxShowNum}个`);
          return;
        }
        const {scrollWidth: boxWidth, scrollHeight: boxHeight} = this.$('.mainBox')[0]
          , setWidth = setting.config.width
          , setHeight = setting.config.height;
        let flatinfo = [], top = null, left = null;
        this.customize[this.state.index].comps.forEach((item, subIndex) => flatinfo.push({...item.props.style, originIndex: subIndex}));
        if(flatinfo.length > 0){
          flatinfo.map(item => {
            item.right = item.left + item.width;
            item.bottom = item.top + item.height;
            item.dotLT = [item.left, item.top];
            item.dotRT = [item.right, item.top];
            item.dotLB = [item.left, item.bottom];
            item.dotRB = [item.right, item.bottom];
          });
          let flatinfoByRightArr = _cloneDeep(flatinfo.sort((a, b) => a.right < b.right))
            , flatinfoByBottomArr = _cloneDeep(flatinfo.sort((a, b) => a.bottom < b.bottom))
            , ans = [], ans_spec = [];
          // 将边缘虚拟矩形加到数组最后端
          flatinfoByRightArr.push({
            left: 0, right: 0, width: 0,
            top: flatinfoByBottomArr[0].bottom,
            bottom: boxHeight,
            height: boxHeight - flatinfoByBottomArr[0].bottom
          });
          flatinfoByBottomArr.push({
            left: flatinfoByRightArr[0].right,
            right: boxWidth,
            width: boxWidth - flatinfoByRightArr[0].right,
            top: 0, bottom: 0, height: 0
          });
          // 循环找到所有摆放可能
          flatinfoByBottomArr.forEach(item => {
            flatinfoByRightArr.forEach(subItem => {
              let tmpObj = {};
              tmpObj.dot = [subItem.right, item.bottom];
              tmpObj.dotStr = `${tmpObj.dot[0]}${tmpObj.dot[1]}`;
              if(
                ans.findIndex(item => item.dotStr === tmpObj.dotStr) === -1
                && ans_spec.findIndex(item => item.dotStr === tmpObj.dotStr) === -1
                && flatinfo.findIndex(item => tmpObj.dot[0] < item.dotRB[0] && tmpObj.dot[1] < item.dotRB[1]) === -1
              ){
                tmpObj.width = boxWidth - tmpObj.dot[0];
                tmpObj.height = boxHeight - tmpObj.dot[1];
                tmpObj.area = tmpObj.width * tmpObj.height;
                if(tmpObj.dot[1] === 0){
                  ans_spec.push(tmpObj);
                }else{
                  ans.push(tmpObj);
                }
              }
            });
          });
          // 摆放可能按面积排序
          ans = [...ans_spec.sort((a, b) => b.area - a.area), ...ans.sort((a, b) => b.area - a.area)];
          ans.some(item => {
            if(item.width >= setWidth && item.height >= setHeight){
              left = item.dot[0];
              top = item.dot[1];
              return true;
            }
          })
          if(left === null){
            left = (boxWidth - setWidth) / 2;
            top = (boxHeight - setHeight) / 2;
          }
        }else{
          top = 0;
          left = 0;
        }
        let config = {
          props: {
            style: {
              top,
              left,
              width: setWidth,
              height: setHeight
            }
          },
          config: {
            titleName: setting.cn,
            hasGroup: setting.config.hasGroup || false,
            groupMaster: setting.config.groupMaster || false,
            hasSearch: setting.config.hasSearch || false,
          },
          subProps: {
            name: setting.compName,
          }
        };
        ['symbol'].forEach(key => this.isLegal(setting[key]) && (config.subProps[key] = setting[key]))
        this.loadPluginPath(setting.compName, config);
        break;
      case 'groupSelect':
        // 分组选择事件
        let compTmp = this.customize[this.state.index].comps[index];
        compTmp.config.groupId = data;
        this.$(`#${compTmp.id} .pluginTitle .groupId`).forEach(ele => ele.textContent = data + 1);
        break;
      case 'searchSelect':
        // 个体查询事件
        this.customize[this.state.index].comps[index].subProps.symbol = data.uuid;
        this.setState({});
        break;
    }
  }

  grenMenu(item, index){
    let nameMap = {
      edit: '编辑面板',
      rename: '修改名称',
      delete: '删除面板'
    }
    return (
      <Menu>
        {
          item.setItem.map(item => {
            return (
              <Menu.Item
                onClick={(e) => this.onClickHandler({e, type: item, index})}
                key={item}>
                <span>{nameMap[item]}</span>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )
  }

  onChangeHandle({data, index, dataIndex, groupId, e, compId}){
    this.updateSelect(e, compId, index);
    this.customize[this.state.index].comps.map(comp => comp.subProps.symbol = '');
    this.setState(prev => {
      prev.actionNameByGroup[groupId] = data.uuid;
      return prev;
    })
  }

  getSubComp(Comp, compIndex, Component) {
    // 生成子组件
    const {name, props, config, type} = Comp;
    const subCompId = [name, compIndex, type].join('_');
    let actionName, tmpData;
    Comp.id = Comp.props.id = Comp.config.id = subCompId;
    this.lastMountComp && (this.lastMountComp.id = subCompId);
    let subProps = {
      ...Comp.subProps,
      onClickHandler: this.onClickHandler,
    }
    if(Comp.subProps.symbol){
      actionName = config_mod[Comp.name].actionName
      tmpData = actionName.split('-');
      tmpData[0] = Comp.subProps.symbol;
      subProps.actionName = tmpData.join('-');
    }else if(config.hasGroup && !config.groupMaster && this.state.actionNameByGroup[config.groupId] !== ''){
      actionName = config_mod[Comp.name].actionName
      if(actionName.constructor === String){
        tmpData = actionName.split('-');
        tmpData[0] = this.state.actionNameByGroup[config.groupId];
        subProps.actionName = tmpData.join('-');
      }else if(actionName.constructor === Array){
        subProps.actionName = [this.state.actionNameByGroup[config.groupId] + '-7-6'];
      }
    }
    config.groupMaster && (subProps.tableProps = subProps.changeProps = {
      onRow: {
        onChangeHandle: arg => this.onChangeHandle({groupId: this.customize[this.state.index].comps[compIndex].config.groupId, ...arg})
      }
    });
    return (
      <div
        className="subComp"
        {...props}
        key={subCompId}
      >
        <div className="resizable">
          {
            ['top', 'right', 'bottom', 'left', 'tl', 'tr', 'br', 'bl'].map(type => {
              return (
                <div
                  style={{zIndex: parseInt(subCompId.split('_')[1]) + 10}}
                  key={[subCompId, type].join('-')}
                  data-type={[subCompId, type].join('-')}
                  onMouseDown={e => this.globalResizable && config.resizable && this.startHandle(e)}
                  className={`resize-${type}`}
                ></div>
              )
            })
          }
        </div>
        <Oper
          config={config}
          globalMoveable={this.globalMoveable}
          startHandle={this.startHandle}
          subCompId={subCompId}
          onClickHandler={this.onClickHandler}
          index={compIndex}
          actionNameByGroup={this.state.actionNameByGroup}
          compConfig={subProps}
        />
        <div style={{width: '100%', height: 'calc(100% - 32px)'}}>
          <Component {...subProps} />
        </div>
      </div>
    )
  }

  render() {
    console.log('customize组件渲染次数: ', this.renderTime);
    return (
      <div
        className="customize"
        id={this.compId}
      >
        <div className="handlerBar">
          <div className="handlerBarLeft">
            {
              this.state.barConfig.map((item, index) => {
                let menu = this.grenMenu(item, index);
                return (
                  <div
                    onClick={e => this.onClickHandler({e, index, data: item, type: 'select'})}
                    key={index}
                    className={`ant-dropdown-link barMenuLeft ${this.state.index === index? 'on': ''}`}>
                    {item.name}
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Icon className="caret-down" type="caret-down" />
                    </Dropdown>
                  </div>
                )
              })
            }
            <div className="barMenuAdd" onClick={(e) => this.onClickHandler({e, type: 'add'})}>
              <Icon type="plus" />
            </div>
          </div>
          <div className="handlerBarRight">
            {/*<div className="barMenuRight" title="工具"><Icon type="tool" /></div>
            <div className="barMenuHelp">帮助</div>
            <div className="barMenuRight" title ><Icon type="appstore" /></div>*/}
            <div className="barMenuRight" title="保存"><Icon type="save" onClick={e => this.onClickHandler({e, type: 'save'})} /></div>
          </div>
        </div>
        <div ref='mainBox' className='mainBox'>
          { this.state.globalComp.comps.map((comp, index) => this.getSubComp(this.globalComp.comps[index], index, comp)) }
          { this.state.customize.length > 0 && this.state.customize[this.state.index].comps.map((comp, index) => this.getSubComp(this.customize[this.state.index].comps[index], index, comp)) }
        </div>
      </div>
    );
  }
}

export default Customize;

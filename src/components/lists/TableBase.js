import React from 'react';
import {Button} from 'antd';
import PropTypes from "prop-types";
import './TableBase.less';
import { MouseEventTool } from "@/utils/BaseTools.js";
import _round from "lodash/round";
import _orderBy from "lodash/orderBy";
import _cloneDeep from 'lodash/cloneDeep';
import { transfromData, filterRN } from '@/utils/FormatUtils';
import { KeyCode } from './otherConfig';
import LoadOrigin from '@/components/lists/LoadOrigin';

class TableBase extends MouseEventTool{
  constructor(props){
    super(props);
    // tabs高
    this.tabsHeight = 30;
    // 竖型滚动条最小高
    this.minVerticalHeight = 20;
    // 额外显示数量
    this.otherShowNum = 1;
    // 固定列的总宽度
    this.fixedWidth = 0;
    // 用于第一次选中时发起默认事件, 避免重复发起
    this.isSpaceEmit = false;
    // 开始数据行在全部数据中的下标
    this.startNum = 0;
    // 当前选中行下标, 相对于显示数据
    this.activeRow = -1;
    // 虚拟数据容器
    this.virtualData = [];
    // 排序字段或默认排序
    this.sortType = props.tableProps.defaultSort || 'default';
    // 固定列
    this.columnsFixed = [];
    // 非固定列
    this.columnsNormd = [];
    // 区分固定列及非固定列
    props.tableProps.columns.forEach(item => item.isFixed
      ? (this.columnsFixed.push(item), this.fixedWidth += item.width)
      : this.columnsNormd.push(item));
    // 鼠标是否移入表格显示范围内
    this.corInTable = false;
    // 用于行选择的事件发起延时
    this.selectHandleTime = null;
    // 表格类型, common(通用)/option(自选), 默认common
    this.tableType = this.props.tableProps.tableType || 'common';

    // 处理state数据
    const tmpData = {};
    // 非固定列统一列宽
    tmpData.colWidth = 80;
    // 统一列高
    tmpData.colHeight = 28;
    // 剩余空间
    let autoWidth = props.width - this.columnsNormd.length * tmpData.colWidth - this.fixedWidth;
    if(autoWidth > 0){
      // 说明有剩余空间, 则分配到每一非固定列
      tmpData.colWidth += autoWidth / this.columnsNormd.length;
    }
    // 表格非固定列实际宽
    tmpData.tableWidth = this.columnsNormd.length * tmpData.colWidth;
    // 表格显示高
    tmpData.tableHeight = props.height;
    this.state = {
      ...tmpData,
      horizontalWidth: _round((this.props.width - this.fixedWidth) / tmpData.tableWidth * this.props.width, 2),
      verticalHeight: props.height,
      showNum: Math.ceil((props.height - this.tabsHeight) / tmpData.colHeight),
      showData: [],
      menuLeft: 0,
      menuTop: 0,
    }
    if(props.data && props.data[props.actionName]){
      // 数据已经存在则需要重新计算部分值
      let nextdata = props.data[props.actionName];
      // 重新计算表格高
      this.state.tableHeight = nextdata.count * this.state.colHeight;
      // 重新计算竖型滚动条高
      this.state.verticalHeight = Math.max(_round((this.props.height - this.tabsHeight - this.state.colHeight) / this.state.tableHeight * this.props.height, 2), this.minVerticalHeight);
      // 生成虚拟数据
      this.virtualData = this.getVirtualData(props.data[props.actionName], props.tableProps);
      // 取出显示数据
      this.virtualData.length > 0 && (this.state.showData = this.virtualData.slice(this.startNum, this.state.showNum + this.otherShowNum));
    }

    // 显示虚拟滚动条
    this.showScrollBar = this.showScrollBar.bind(this);
    // 隐藏虚拟滚动条
    this.hiddenScrollBar = this.hiddenScrollBar.bind(this);
    // 滚动条处理事件
    this.scrollHandler = this.scrollHandler.bind(this);
    // 数据刷新点击事件
    this.reloadHandle = this.reloadHandle.bind(this);
    // 数据排序点击事件
    this.sortableHandle = this.sortableHandle.bind(this);
    // 数据行点击事件
    this.onClickHandle = this.onClickHandle.bind(this);
    // 数据行右击事件
    this.onContextMenuHandle = this.onContextMenuHandle.bind(this);
    // 数据行双击事件
    this.onDoubleClickHandle = this.onDoubleClickHandle.bind(this);
    // 执行默认函数
    this.execFun = this.execFun.bind(this);
    // 键盘按键处理事件
    this.onKeyPress = this.onKeyPress.bind(this);

    if(this.tableType === 'option'){
      this.addSelfOption();
    }
  }

  init(props, order='default', isSave=false){
    this.sortType = order;
    this.virtualData = [];
    this.isSpaceEmit = false;
    this.activeRow = -1;
    if(!isSave){
      this.startNum = 0;
      this.$(`#${this.compId} .vertical .handle`).forEach(ele => ele.style.top = '0px');
      //this.$(`#${this.compId} .horizontal .handle`).forEach(ele => ele.style.left = '0px');
      //this.$(`#${this.compId} .detailOuter table`).forEach(ele => ele.style.marginLeft = '0%');
      this.$(`#${this.compId} .TbodyInner table`).forEach(ele => ele.style.marginTop = '0%');
      this.$(`#${this.compId} .TbodyInner .selected`).forEach(ele => ele.classList.remove('selected'));
    }
    let stateData = {colWidth: 80}, autoWidth = props.width - this.columnsNormd.length * stateData.colWidth - this.fixedWidth;
    if(autoWidth > 0){
      // 说明有剩余空间
      stateData.colWidth += autoWidth / this.columnsNormd.length;
    }
    stateData.tableWidth = this.columnsNormd.length * stateData.colWidth;
    let hasData = false;
    if(props.data && props.data[props.actionName]){
      hasData = true;
      // 数据已经存在则需要重新计算部分值
      let nextdata = props.data[props.actionName];
      // 重新计算表格高
      stateData.tableHeight = nextdata.count * this.state.colHeight;
      // 重新计算竖型滚动条高
      stateData.verticalHeight = Math.max(_round((props.height - this.tabsHeight - this.state.colHeight) / this.state.tableHeight * props.height, 2), this.minVerticalHeight);
      // 生成虚拟数据
      this.virtualData = this.getVirtualData(props.data[props.actionName], props.tableProps);
      if(this.tableType !== 'common'){
        let [sortKey, sortType] = order.split('_');
        this.virtualData = _orderBy(this.virtualData, sortKey, sortType);
      }
      // 取出显示数据
      this.virtualData.length > 0 && (stateData.showData = this.virtualData.slice(this.startNum, this.state.showNum + this.otherShowNum));
    }
    this.setState({
      ...stateData,
      activeRow: -1,
    }, () => {
      if(!(this.tableType === 'option')){
        this.emitSocketRequest('sub');
      }
      hasData && this.props.tableProps && this.props.tableProps.isHeader && this.switchSelect(0, 'auto');
    })
  }

  sortableHandle(e) {
    // 排序
    e.stopPropagation();
    if(!this.props.data[this.props.actionName])return;
    let ele = e.currentTarget, dataValue = ele.getAttribute("data-value"), sortType;
    // if(dataValue === 'stockCode')dataValue = 'default';
    ele.classList.contains('desc') && (sortType = 'asc');
    ele.classList.contains('asc') && (sortType = 'desc');
    !sortType && (sortType = 'desc');
    [...this.$(`#${this.compId} .desc`), ...this.$(`#${this.compId} .asc`)].forEach(element => {
      element.classList.contains('desc') && element.classList.toggle('desc');
      element.classList.contains('asc')  && element.classList.toggle('asc');
    })
    ele.classList.toggle(sortType);
    this.init(this.props, `${dataValue}_${sortType}`);
  }

  onClickHandle({e, data, index, dataIndex}){
    // 数据行点击事件处理函数
    this.switchSelect(index, 'click');
  }

  scrollOne(startNum, hasCalc){
    // 注意事件结束后切换选中项switchSelect
    console.log('滚动并切换选中行');
    if(startNum < 0 || startNum > this.props.data[this.props.actionName].count - this.state.showNum){
      return;
    }
    let index = startNum < this.startNum? 0: this.state.showNum - 1;
    this.startNum = startNum;
    if(!hasCalc){
      let toppx = startNum / this.props.data[this.props.actionName].count * (this.props.height - this.state.colHeight);
      this.$(`#${this.compId} .vertical .handle`).forEach(ele => ele.style.top = `${toppx}px`);
    }
    let [symbol, dataType] = this.props.actionName.split('-');
    this.emitEvent([{symbol, dataType: parseInt(dataType), order: this.sortType, start: this.startNum, end: this.startNum + this.state.showNum + 5}]);
    this.setState({showData: this.virtualData.slice(this.startNum, this.startNum + this.state.showNum + this.otherShowNum)}, () => {
      this.switchSelect(index, 'auto');
    });
  }

  getVirtualData({count, data}, tableProps){
    // 生成虚拟数据, 生成数量为count个数据的数组, 并按照每一列的key赋默认值--, 返回新数据
    if(!count)return [];
    !tableProps && (tableProps = this.props.tableProps);
    let virtualData = (new Array(count)).fill({isSpace: true});
    virtualData.map(item => tableProps.columns.forEach(subItem => item[subItem.dataIndex] = '--'));
    virtualData.splice(this.startNum, data.length, ...data);
    return virtualData;
  }

  batchBindEvent() {
    // 批量绑定事件
    // 列宽处理事件
    this.addEvent('mousedown', 'startHandle', `#${this.compId} .mouseHandle`);
    this.$(`#${this.compId}`).forEach(ele => {
      // 鼠标移入事件
      ele.addEventListener("mouseover", this.showScrollBar);
      // 鼠标移出事件
      ele.addEventListener("mouseout", this.hiddenScrollBar);
      // 滚轮事件
      ele.addEventListener("mousewheel", this.scrollHandler);
    });
    // 数据刷新点击事件
    this.$(`#${this.compId} .TheadWrap .reloadzxg`).forEach(ele => ele.addEventListener("click", this.reloadHandle));
    // 数据排序点击事件
    this.$(`#${this.compId} .TheadWrap .sortable`).forEach(ele => ele.addEventListener("click", this.sortableHandle));
    // 键盘按键点击事件
    document.addEventListener('keydown', this.onKeyPress);
  }

  batchUnBindEvent() {
    // 批量解绑事件
    this.removeEvent('mousedown', 'startHandle', `#${this.compId} .mouseHandle`);
    this.$(`#${this.compId} .TheadWrap .reloadzxg`).forEach(ele => ele.removeEventListener("click", this.reloadHandle));
    this.$(`#${this.compId} .TheadWrap .sortable`).forEach(ele => ele.removeEventListener("click", this.sortableHandle));
    this.$(`#${this.compId}`).forEach(ele => {
      ele.removeEventListener("mouseover", this.showScrollBar);
      ele.removeEventListener("mouseout", this.hiddenScrollBar);
      ele.removeEventListener("mousewheel", this.scrollHandler);
    });
    document.removeEventListener('keydown', this.onKeyPress);
  }

  emitSocketRequest(type){
    // type为sub时发起订阅, unsub时取消订阅
    let [symbol, dataType] = this.props.actionName.split('-');
    if(type === 'sub'){
      this.emitEvent([{symbol, dataType: parseInt(dataType), order: this.sortType, start: this.startNum, end: this.startNum + this.state.showNum + 5}]);
    }else if(type === 'unsub'){
      this.unemitEvent(this.props.actionName);
    }else if(type === 'unmount'){
      this.unemitEvent();
    }
  }

  onKeyPress(e) {
    // 按键事件处理
    if(!this.props.data[this.props.actionName])return;
    if(e.keyCode < 37 || e.keyCode > 40 || this.corInTable === false || this.props.isShowKeyBoard)return;
    !e.eventType && (e.eventType = 'board')
    let activeRow;
    //this.$(`#${this.compId} .TbodyInner table`).forEach(ele => ele.style.marginTop = `0px`);
    switch(e.keyCode){
      case KeyCode.UP:
        activeRow = this.activeRow - 1
        if(activeRow >= 0){
          this.switchSelect(activeRow, e.eventType);
        }else{
          this.scrollOne(this.startNum - 1);
        }
        break;
      case KeyCode.DOWN:
        activeRow = this.activeRow + 1
        if(activeRow < this.state.showNum && this.props.data[this.props.actionName].count > activeRow){
          this.switchSelect(activeRow, e.eventType);
        }else{
          this.scrollOne(this.startNum + 1);
        }
        break;
    }
  }

  showScrollBar(e){
    // 显示滚动条
    this.corInTable = true;
    this.$(`#${this.compId} .Scrollbar`).forEach(ele => ele.style.opacity = 0.8);
  }

  hiddenScrollBar(e){
    // 隐藏滚动条
    this.corInTable = false;
    this.$(`#${this.compId} .Scrollbar`).forEach(ele => ele.style.opacity = 0);
  }

  switchSelect(index, type){
    // 切换选中行
    console.log('切换选中行');
    if(index < 0 || index > this.state.showNum)return;
    this.activeRow = index;
    this.$(`#${this.compId} .TbodyInner tbody tr.selected`).forEach(ele => ele.classList.remove('selected'));
    let ele;
    (ele = this.$(`#${this.compId} .TbodyInner .brief tr`), ele.length > index && ele[index].classList.add('selected'));
    (ele = this.$(`#${this.compId} .TbodyInner .detailOuter tr`), ele.length > index && ele[index].classList.add('selected'));
    if(index === 0){
      this.$(`#${this.compId} .TbodyInner table`).forEach(ele => ele.style.marginTop = '0px');
    }else if(index === this.state.showNum - 1){
      this.$(`#${this.compId} .TbodyInner table`).forEach(ele => ele.style.marginTop = `${this.props.height - this.state.colHeight - this.state.showNum * this.state.colHeight}px`);
    }
    if(['auto', 'click', 'board', 'wheel', 'drop'].indexOf(type) > -1)this.execFun(index)
  }

  getAttribute(e){
    e.stopPropagation();
    let tmpObj = {type: e.target.getAttribute("data-type")};
    switch(tmpObj.type){
      case 'horizontalScrollbar':
        tmpObj.operType = 'move';
        tmpObj.config = [{
          main: 'left',
          maxData: this.props.width - this.state.horizontalWidth,
          minData: 0
        }]
        tmpObj.goingCallBack = (data, operInfo) => {
          operInfo.config.forEach(item => {
            let tmp = data[item.main];
            tmp < item.minData && (tmp = item.minData);
            tmp > item.maxData && (tmp = item.maxData);
            tmp = tmp / this.props.width;
            this.mouseStartInfo[`now_${item.main}`] = tmp;
            operInfo.tarEle.forEach(ele => ele.style[item.main] = `${tmp * 100}%`);
          })
          this.$(`#${this.compId} .detailOuter table`).forEach(ele => ele.style.marginLeft = `${-1 * this.mouseStartInfo['now_left'] * 100}%`);
          return true;
        }
        break;
      case 'verticalScrollbar':
        tmpObj.operType = 'move';
        tmpObj.config = [{
          main: 'top',
          maxData: this.props.height - this.state.colHeight - this.state.verticalHeight,
          minData: 0
        }]
        tmpObj.goingCallBack = (data, operInfo) => {
          operInfo.config.forEach(item => {
            let tmp = data[item.main];
            tmp < item.minData && (tmp = item.minData);
            tmp > item.maxData && (tmp = item.maxData);
            this.mouseStartInfo[`now_${item.main}`] = tmp;
            operInfo.tarEle.forEach(ele => {
              ele.style[item.main] = tmp + 'px';
              if(['width', 'height'].indexOf(item.main) > -1){
                ele.style[`min-${item.main}`] = tmp + 'px';
                ele.style[`max-${item.main}`] = tmp + 'px';
              }
            });
            let topHeight = tmp / (this.props.height - this.state.colHeight - this.state.verticalHeight) * this.state.tableHeight;
            tmp = Math.floor(topHeight / this.state.colHeight);
            let toppx = topHeight - tmp * this.state.colHeight;
            this.$(`#${this.compId} .TbodyInner table`).forEach(ele => ele.style.marginTop = `${-1 * toppx}px`);
            if(tmp !== this.startNum){
              this.scrollOne(tmp - (tmp !== 0 && this.state.showNum || tmp), true);
            }
          });
          return true;
        };
        break;
      case 'tableColHandle':
        tmpObj.operType = 'resize-right';
        let index = e.target.getAttribute("data-index");
        tmpObj.tarEle = this.$(`#${this.compId} tr .mainCol${index}`)
        tmpObj.config = [{
          main: 'width',
          maxData: 300,
          minData: 20
        }]
        tmpObj.endCallBack = (data) => {
          this.setState(prevState => {
            prevState.tableWidth = this.$(`#${this.compId} .detailOuter`)[0].clientWidth;
            prevState.horizontalWidth = _round((this.props.width - this.fixedWidth) / prevState.tableWidth * this.props.width, 2);
            return prevState;
          })
        }
        break;
    }
    return tmpObj;
  }

  execFun(index){
    // 当活动行变动时执行函数onChangeHandle函数, 参数为当前行数据信息
    let tmp, handleTime, self = this;
    window.currentSelectItem = this.state.showData[index];
    this.props.tableProps
      && (tmp = this.props.tableProps, tmp)
      && (tmp = tmp.onRow, tmp)
      && (tmp = tmp.onChangeHandle, tmp)
      && (
        this.selectHandleTime = Date.now(),
        handleTime = this.selectHandleTime,
        setTimeout(() => {
          if(handleTime === self.selectHandleTime && self.state.showData[index]){
            if(self.state.showData[index].isSpace){
              self.isSpaceEmit = true;
            }else{
              self.isSpaceEmit = false;
              tmp({data: self.state.showData[index], compId: this.compId, index, dataIndex: self.startNum + index})
            }
          }
        }, 100)
      );
  }
  reloadHandle(e) {
    // 刷新
    e.stopPropagation();
    if(!this.props.data[this.props.actionName])return;
    let showData = (new Array(this.state.showData.length < this.state.showNum? this.state.showData.length: this.state.showNum + this.otherShowNum)).fill({});
    showData.map(item => this.props.tableProps.columns.forEach(subItem => item[subItem.dataIndex] = '--'));
    this.setState({showData}, () => {
      if(this.tableType === 'common'){
        this.emitSocketRequest('sub');
      }else if(this.tableType === 'option'){
        this.addSelfOption();
      }
    })
  }

  scrollHandler(e){
    // 滚轮事件处理
    this.onKeyPress({keyCode: e.wheelDelta > 0? KeyCode.UP: KeyCode.DOWN, eventType: 'wheel'});
  }

  onContextMenuHandle({e, data, index, dataIndex}){
    // 右击弹出自选面板
    this.switchSelect(index, 'auto');
    this.showAddOptionPanel(e, data, index);
  }

  onDoubleClickHandle({e, data, index, dataIndex}){
    // 双击显示详情页
    this.tableType === 'option' && (data.isOption = true);
    this.props.controller({isShowQuoteDetails: true, quoteDetailsData: data});
  }

  getNewRows(args){
    // 传入事件与本地事件合并
    let newRows = {};
    if(this.props.tableProps && this.props.tableProps.onRow) {
      let handlersObj = this.props.tableProps.onRow;
      let handlers = Object.keys(handlersObj);
      let that = this;
      handlers.forEach(name => {
        if(['onChangeHandle'].indexOf(name) === -1){
          // 非dom事件过滤
          newRows[name] = (e) => {
            handlersObj[name]({e, ...args, compId: that.compId});
            that[`${name}Handle`] && that[`${name}Handle`]({e, ...args});
          }
        }
      });
    }
    ['onClick', 'onContextMenu', 'onDoubleClick']
      .forEach(name => !newRows[name] && (newRows[name] = (e) => this[`${name}Handle`]({e, ...args})));
    return newRows;
  }

  getStyleWidth(width){
    width += 'px';
    return {
      width,
      maxWidth: width,
      minWidth: width
    }
  }

  grenHeader(){
    const {tableProps} = this.props;
    return (
      <div className="TheadWrap">
        {
          this.columnsFixed.length > 0 && (
            <table className="brief">
              <thead>
                <tr>
                  {
                    this.columnsFixed.map(item =>
                      <th
                        style={this.getStyleWidth(item.width)}
                        key={item.dataIndex}
                        data-value={item.dataIndex}
                        className={`${item.dataIndex} ${!!item.isSorter && 'sortable' || ''} ${!!item.isReload && 'reloadzxg' || ''}`}>
                        <span>{item.title}</span>
                      </th>
                    )
                  }
                </tr>
              </thead>
            </table>
          )
        }
        <div className="detailOuter">
          <table className="detail">
            <thead>
              <tr>
                {
                  this.columnsNormd.map((item, index) => {
                    let classname = [
                      `mainCol${index}`,
                      item.dataIndex,
                    ];
                    item.isSorter && classname.push('sortable');
                    item.isReload && classname.push('reloadzxg');
                    tableProps.defaultSort && tableProps.defaultSort.split('_')[0] === item.dataIndex && classname.push(tableProps.defaultSort.split('_')[1]);
                    return (
                      <th
                        key={item.dataIndex}
                        data-value={item.dataIndex}
                        style={this.getStyleWidth(this.state.colWidth)}
                        className={classname.join(' ')}
                      >
                        <span>{item.title}</span>
                        <div className="resize-handle mouseHandle" style={{right: '0px'}} data-type='tableColHandle' data-index={index}></div>
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
          </table>
        </div>
      </div>
    )
  }

  grenBody(){
    if(this.state.showData.length === 0){
      return (
        <div className="loadingSpin">
          {
            this.tableType !== 'option'
              && <LoadOrigin />
              || <Button className="isAddOption" type="default" icon="plus" size='large' onClick={(e) => {e.stopPropagation(); this.props.controller({isShowKeyBoard: true})}}>添加自选</Button>
          }
        </div>
      );
    }

    let showData = this.state.showData;

    return (
      <div className="TbodyInner">
        {
          this.columnsFixed.length > 0 && (
            <table className="brief">
              <tbody>
                {
                  showData.map((subitem, index) => {
                    let activeRow = index + this.startNum;
                    let item = {...subitem, order: activeRow + 1};
                    //item.order = activeRow + 1;
                    return(
                      <tr
                        data-index={activeRow}
                        {...this.getNewRows({data: item, index, dataIndex: activeRow})}
                        key={index}
                        className={item.uuid && item.uuid.replace('.', '') || ''}
                      >
                        {
                          this.columnsFixed.map((subItem, subIndex) => {
                            let data = item[subItem.dataIndex], temp;
                            let classname = [
                              subItem.dataIndex,
                            ];
                            this.tableType === 'option' && classname.push('option');
                            (subItem.dataIndex === 'stockName' && item.isOption && this.tableType !== 'option') && classname.push('is-my-stock');
                            if(subItem.dataIndex === this.props.tableProps.RNFlag){
                              temp = filterRN({}, item.uuid)
                              let ad = item['netChangeRatio'] !== 0 && (item['netChangeRatio'] > 0? 'under': 'upper') || 'uuuer';
                              temp.tradflag === 'R' && ad === 'under' && classname.push('rnFlag_R_up');
                              temp.tradflag === 'R' && ad === 'upper' && classname.push('rnFlag_R_down');
                              temp.tradflag === 'R' && ad === 'uuuer' && classname.push('rnFlag_R');
                              temp.subnew === 'N' && ad === 'under' && classname.push('rnFlag_N_up');
                              temp.subnew === 'N' && ad === 'upper' && classname.push('rnFlag_N_down');
                              temp.tradflag === 'N' && ad === 'uuuer' && classname.push('rnFlag_N');
                            }
                            return (
                              <th
                                style={this.getStyleWidth(subItem.width)}
                                key={subIndex}
                                className={classname.join(' ')}>
                                <span title={data}>{data}</span>
                              </th>
                            )
                          })
                        }
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          )
        }
        <div className="detailOuter">
          <table className="detail">
            <tbody>
              {
                showData.map((subitem, index) => {
                  let activeRow = index + this.startNum;
                  let item = {...subitem, order: activeRow + 1};
                  //item.order = activeRow + 1;
                  return(
                    <tr
                      data-index={activeRow}
                      {...this.getNewRows({data: item, index, dataIndex: activeRow})}
                      key={index}
                      className={item.uuid && item.uuid.replace('.', '') || ''}
                    >
                      {
                        this.columnsNormd.map((subItem, subIndex) => {
                          let data = item[subItem.dataIndex], temp;
                          let classname = [
                            subItem.dataIndex,
                            `mainCol${subIndex}`,
                          ];
                          this.tableType === 'option' && classname.push('option');
                          (subItem.dataIndex === 'stockName' && item.isOption && this.tableType !== 'option') && classname.push('is-my-stock');
                          if(subItem.setClass){
                            // 外部设置类, 用于配置显示颜色
                            if(subItem.setClass.constructor === Function){
                              temp = subItem.setClass(item, subItem.dataIndex, subItem);
                              temp && classname.push(temp);
                            }else if(subItem.setClass.constructor === String){
                              classname.push(subItem.setClass);
                            }
                          }
                          if(subItem.dataIndex === this.props.tableProps.RNFlag){
                            temp = filterRN({}, item.uuid)
                            temp.tradflag === 'R' && classname.under && classname.push('rnFlag_R_up');
                            temp.tradflag === 'R' && classname.upper && classname.push('rnFlag_R_down');
                            temp.tradflag === 'R' && classname.uuuer && classname.push('rnFlag_R');
                            temp.subnew === 'N' && classname.under && classname.push('rnFlag_N_up');
                            temp.subnew === 'N' && classname.upper && classname.push('rnFlag_N_down');
                            temp.subnew === 'N' && classname.uuuer && classname.push('rnFlag_N');
                          }
                          if(this.isLegal(this.preRenderData)
                            && !isNaN(data)
                            && this.tableType !== 'option'
                            && this.isLegal(this.preRenderData.data[index])
                            && this.preRenderData.data[index].stockCode === item.stockCode
                            && ['stockCode', 'date'].indexOf(subItem.dataIndex) === -1
                          ){
                            // 数据更新增加颜色动画
                            classname.push(this.updateColor(this.preRenderData.data[index][subItem.dataIndex], data));
                          }
                          return (
                            <td
                              className={classname.join(' ')}
                              style={this.getStyleWidth(this.state.colWidth)}
                              key={subIndex}
                            >
                              <span
                                title={data}
                              >
                                {transfromData({data, uuid: item.uuid, info: subItem})}
                              </span>
                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render(){
    console.log('table渲染次数: ', this.props.actionName , this.compId, this.renderTime);
    return (
      <div
        className={`TableOrigin table-${this.tableType}`}
        id={this.compId}
        ref={node => this.node = node}
        data-actionname={this.props.actionName}>
        <div className="StockList StockGrid ScrollbarOuter">
          { this.grenHeader() }
          <div className="TbodyWrap">
            { this.grenBody() }
            <div className="Scrollbar vertical">
              <div className="handle mouseHandle" data-type="verticalScrollbar" style={{height: `${Math.max(this.state.verticalHeight, this.minVerticalHeight)}px`, top: '0px'}}></div>
            </div>
            <div className="Scrollbar horizontal">
              <div className="handle mouseHandle" data-type="horizontalScrollbar" style={{width: `${this.state.horizontalWidth}px`, left: '0px'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TableBase.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

TableBase.defaultProps = {
  width: 0,
  height: 0
}

export default TableBase;

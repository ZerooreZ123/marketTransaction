import React from 'react';
import {connect} from 'react-redux';
import { MouseEventTool } from '@/utils/BaseTools.js';
import PropTypes from "prop-types";
import { Checkbox, Icon, Input, Popover, Button } from 'antd';
import { SketchPicker } from 'react-color';
import _cloneDeep from 'lodash/cloneDeep';
import _zipWith from 'lodash/zipWith';
import './IndexSetting.less';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {updateconfig} from '@/actions/';
import { indexConfig, } from '@/components/lists/klineConfig.js';

class IndexSetting extends MouseEventTool{
  constructor(props, context){
    super(props);
    this.state = {
      visible: false,
      config: {},
      updateFlag: true
    }
    this.dataValueName = {
      index: 'indexSettingPanel'
    }
    this.mouseStartInfo = {};
    Object.values(this.dataValueName).forEach(value => this.mouseStartInfo[value] = null);
    props.setRef && props.setRef(this);
    this.getIndexSettingModalContent = this.getIndexSettingModalContent.bind(this);
    this.getAttribute = this.getAttribute.bind(this);
    this.updateView = this.updateView.bind(this);
    //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.visible !== this.state.visible || nextState.updateFlag !== this.state.updateFlag){
      if(nextState.visible && this.configBak === undefined && Object.keys(nextState.config).length > 0)this.configBak = _cloneDeep(nextState.config);
      return true;
    }
    return false;
  }

  updateView(data){
    this.setState(
      data,
      () => {
        if(this.state.visible){
          window.canKeyBoard = false;
          this.addEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.index}`)
        }else{
          window.canKeyBoard = true;
          this.removeEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.index}`)
        }
      }
    );
  }

  handleChange({type, data, key, origin, index, indkey}){
    const { parentNode } = this.props;
    origin && (indkey = {chart: 'showByIndChart', line: 'showByIndLine'}[origin.showType]);
    switch(type){
      case 'color':
        origin.tipConfig.configs[index].stroke = data.hex;
        this.$(`#${this.compId} .selectColor`)[index].style.background = data.hex;
        parentNode.rendered = false;
        parentNode.setState(prev => ( prev[indkey].map(item => item.type === origin.type && (item.tipConfig.configs[index].stroke = data.hex)), prev));
        break;
      case 'ok':
        let storageConfig = JSON.parse(localStorage.getItem('kline:config')) || {};
        storageConfig[origin.type] = {
          options: data.options,
          configs: data.tipConfig.configs
        };
        localStorage.setItem('kline:config', JSON.stringify(storageConfig))
        this.props.updateconfig({type: 'index'});
        this.updateView({visible: false});
        this.configBak = undefined;
        break;
      case 'close':
        this.updateView({visible: false});
        this.configBak = undefined;
        break;
      case 'reset':
      case 'reset_all':
        this.updateView(prev => ({updateFlag: !prev.updateFlag, config: _cloneDeep(origin)}));
        parentNode.rendered = false;
        parentNode.setState(prev => (prev[indkey] = prev[indkey].map(item => item.type === origin.type && _cloneDeep(origin) || item), prev));
        break;
      case 'canel':
        this.updateView({visible: false});
        parentNode.rendered = false;
        parentNode.setState(prev => (prev[indkey] = prev[indkey].map(item => item.type === origin.type && _cloneDeep(origin) || item), prev));
        this.configBak = undefined;
        break;
      case 'update-options':
        origin.options[key] = parseInt(data);
        break;
      case 'update-config':
        origin.tipConfig.configs[index].isShow = data;
        parentNode.rendered = false;
        parentNode.setState(prev => ( prev[indkey].map(item => item.type === origin.type && (item.tipConfig.configs[index].isShow = data)), prev));
        break;
    }
  }

  getAttribute(e) {
    e.stopPropagation();
    let targetEle = e.currentTarget;
    let tmpObj = { tarEle: [targetEle], type: targetEle.getAttribute("data-type") };
    switch (tmpObj.type) {
      case this.dataValueName.index:
        tmpObj.moveFlag = true;
        tmpObj.operType = 'move';
        tmpObj.config = [{
          main: 'left',
          maxData: window.innerWidth - targetEle.scrollWidth,
          minData: 0
        }, {
          main: 'top',
          maxData: window.innerHeight - targetEle.scrollHeight,
          minData: 0
        }];
        break;
    }
    return tmpObj;
  }

  getIndexSettingModalContent(config){
    let target = _zipWith(
      Object.entries(config.options).map(([optionName, optionValue]) => ({optionName, optionValue})),
      config.tipConfig.configs,
      (a, b) => ({...a, ...b})
    );
    let targetConfig = [{
      title: '参数名',
      key: 'optionName',
    }, {
      title: '参数值',
      key: 'optionValue',
    }, {
      title: '指标线',
      key: 'name',
    }, {
      title: '颜色',
      key: 'stroke',
    }];
    return (
      <div className="index-setting-content">
        <table className="index-setting-table">
          <tr>
            {
              targetConfig.map(item => (
                <th key={item.key}>{item.title}</th>
              ))
            }
          </tr>
          {
            target.map((item, index) => (
              <tr key={index}>
                {
                  targetConfig.map(subItem => (
                    <td key={subItem.key}>
                      {subItem.key === 'optionName' && item[subItem.key]}
                      {subItem.key === 'optionValue' && item[subItem.key] !== undefined && (
                        <Input
                          defaultValue={item[subItem.key]}
                          onChange={e => this.handleChange({type: 'update-options', data: e.target.value, key: item.optionName, origin: config})}
                        />
                      )}
                      {subItem.key === 'name' && item.key !== undefined && (
                        <Checkbox
                          defaultChecked={item.isShow === false? false: true}
                          onChange={e => this.handleChange({type: 'update-config', index, data: e.target.checked, origin: config})}
                        >
                          {item[subItem.key]}
                        </Checkbox>
                      )}
                      {subItem.key === 'stroke' && item[subItem.key] !== undefined && item[subItem.key].constructor === String && (
                        <Popover
                          content={(
                            <SketchPicker
                              color={ item[subItem.key] }
                              onChange={ color => this.handleChange({type: 'color', data: color, origin: config, index}) }
                            />
                          )}
                          overlayClassName="sketchPickerBox"
                          trigger="hover"
                          title="选择颜色"
                          placement="right"
                        >
                          <div className="selectColor" style={{background: item[subItem.key]}}> </div>
                        </Popover>
                      )}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </table>
      </div>
    )
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  switchSettingState(e, index) {
    this.setState(prev => ({...prev, visible: !prev.visible}));
  }

  getRender(){
    const { visible, config } = this.state;
    if(Object.keys(config).length === 0 || !visible)return null;
    const { title } = this.props;
    let showTitle;
    if(title.constructor === Function){
      showTitle = title(config);
    }else{
      showTitle = title;
    }
    console.log('指标设置面板渲染');
    let newConfig = _cloneDeep(config);
    return (
      <div id={this.compId} >
        <div
          className='index-setting indexSettingPanel'
          data-type={this.dataValueName.index}
          style={{
            top: this.mouseStartInfo[`${this.dataValueName.index}_top`],
            left: this.mouseStartInfo[`${this.dataValueName.index}_left`]
          }}
        >
          <div className="index-setting-title moveFlag" >
            <h1>{showTitle}</h1>
            <Icon type="close" className="closePanel" onClick={(e) => this.handleChange({type: 'close'})} />
          </div>
          {this.getIndexSettingModalContent(newConfig)}
          <div className="index-setting-footer">
            <Button size="small" onClick={e => this.handleChange({type: 'reset_all', origin: indexConfig[this.state.config.type]})} type="danger" >重置</Button>
            <Button size="small" onClick={e => this.handleChange({type: 'reset', origin: this.configBak})} >恢复</Button>
            <Button size="small" onClick={e => this.handleChange({type: 'canel', origin: this.configBak})} >取消</Button>
            <Button size="small" type="primary" onClick={e => this.handleChange({type: 'ok', data: newConfig, origin: newConfig})} >确定</Button>
          </div>
        </div>
      </div>
    )
  }

  render(){
    const {visible, updateFlag} = this.state;
    return [false, true].map(flag => flag === updateFlag && this.state.visible? this.getRender.call(this): null);
  }
}

IndexSetting.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  getChildren: PropTypes.func
}

IndexSetting.defaultProps = {
  title: '设置'
}

export default connect(null, {updateconfig})(IndexSetting);

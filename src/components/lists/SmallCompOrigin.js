import React, { Component } from 'react';
import PropTypes from "prop-types";
import { CompBaseClass, MouseEventTool } from '@/utils/BaseTools.js';
import {connect} from 'react-redux';

class SmallCompOrigin extends CompBaseClass{
  constructor(props){
    super(props);
  }

  //渲染单个列表
  render(){
    let {data, actionName, defaultData, type, parseFun, handleFun} = this.props;
    let renderData = data[actionName];
    if(!renderData){
      return defaultData;
    }else if(handleFun){
      return handleFun(renderData, defaultData);
    }else{
      let ans = renderData[type];
      /*
      以下代码不合理, 独立组件应保持功能独立, 无侵入, 低耦合, 判断应放在parseFun方法中
      此代码段会导致组件变复杂, 且复用能力降低, 因此恢复原有代码
      if(data != 0){
        if(parseFun){
          if(type === 'volume' || type === 'amount' ){
            return parseFun(data);
          }else{
            return parseFun(data, 1, 0);
          }
        }else if(this.isLegal(data)){
          return data;
        }else{
          return defaultData;
        }
      }else{
        return '';
      */
      if(parseFun){
        return parseFun(ans);
      }else if(this.isLegal(ans)){
        return ans;
      }else{
        return defaultData;
      }
    }
  }
}

SmallCompOrigin.propTypes = {
  // 用于从数据仓库取数据
  actionName: PropTypes.string.isRequired,
  // 字段键名
  type: PropTypes.string,
  // 数据处理函数
  parseFun: PropTypes.func,
  handleFun: PropTypes.func,
}

SmallCompOrigin.defaultProps = {
  // 默认显示内容
  defaultData: '--',
}

/* *******************
 * 带数据请求的小组件, 继承于SmallCompOrigin, 传参与显示与SmallCompOrigin一致
 * ******************/
class SmallCompOriginByEmit extends SmallCompOrigin {
  constructor(props) {
    super(props);
    [this.symbol, this.dataType] = this.props.actionName.split('-');
  }

  componentDidMount() {
    this.emitEvent([{ symbol: this.symbol, dataType: this.dataType }]);
  }

  componentWillUnmount() {
    this.unemitEvent();
  }
}

SmallCompOrigin = connect(state => ({data: state.Data}))(SmallCompOrigin);
SmallCompOriginByEmit = connect(state => ({data: state.Data}))(SmallCompOriginByEmit);

export {SmallCompOrigin, SmallCompOriginByEmit};

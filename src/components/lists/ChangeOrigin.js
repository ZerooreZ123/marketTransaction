import React, { Component } from 'react';
import './ChangeOrigin.less'
import {Spin} from 'antd';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import { CompBaseClass } from "@/utils/BaseTools.js";
import AddOptionPanelOrigin from './AddOptionPanelOrigin';
import _cloneDeep from 'lodash/cloneDeep';
import {controller} from '@/actions';
import { transfromData } from '@/utils/FormatUtils';
import LoadOrigin from '@/components/lists/LoadOrigin';

class ChangeOrigin extends CompBaseClass{
  constructor(props){
    super(props);
    this.state = {
      rowActive: '',
      menuLeft: null,
      menuTop: null
    }
    this.getNewRows = this.getNewRows.bind(this);
    this.onDoubleClickHandle = this.onDoubleClickHandle.bind(this);
    this.execFun = this.execFun.bind(this);
  }

  componentDidMount() {
    let [symbol, dataType] = this.props.actionName.split('-');
    this.emitEvent([{symbol, dataType: parseInt(dataType)}]);
  }

  componentWillUnmount() {
    this.unemitEvent();
  }

  clearColorClass(){
    //[...this.$(`#${this.compId} .aniupper`), ...this.$(`#${this.compId} .aniunder`)].forEach(ele => ele.classList.remove('aniupper', 'aniunder'));
    //[...this.$(`#${this.compId} .aniupper`), ...this.$(`#${this.compId} .aniunder`)].forEach(ele => ele.removeAttribute("class"));
  }

  onClickHandle({data, index, type, e}){
    this.setState({rowActive: type + index});
    window.currentSelectItem = data;
    this.execFun(index, data, type, e);
  }

  execFun(index, data, type, e){
    // 当活动行变动时执行函数onChangeHandle函数, 参数为当前行数据信息
    let tmp, handleTime, self = this;
    this.props.changeProps
      && (tmp = this.props.changeProps, tmp)
      && (tmp = tmp.onRow, tmp)
      && (tmp = tmp.onChangeHandle, tmp)
      && tmp({data, index, type, e});
  }

  onContextMenuHandle({data, index, type, e}){
  }

  getNewRows(args){
    // 传入事件与本地事件合并
    let newRows = {};
    if(this.props.changeProps && this.props.changeProps.onRow) {
      let handlersObj = this.props.changeProps.onRow;
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

  onDoubleClickHandle({e, data, index, type}){
    this.props.controller({isShowQuoteDetails: true, quoteDetailsData: data});
  }

  renderItem(type, showName, parseNum){
    return (
      <div className="contentBox">
        {
          this.props.data[this.props.actionName][type] && this.props.data[this.props.actionName][type].slice(0, this.props.showNum).map((item, index) => {
            const datalen = this.props.data[this.props.actionName].length;
            return (
              <div
                key={showName + parseNum + index}
                className={`contentItem ${this.state.rowActive === type + index? 'selected': ''}`}
                {...this.getNewRows({data: item, index, type})}
              >
                <div style={{minWidth:'90px'}}>
                  <span>{item['stockName']}</span>
                  <div style={{float:'right'}}>
                    {
                      <span style={{fontSize:'10px',float:'right'}}  className={`${item['netChangeRatio'] > 0? 'under': 'upper'}`}>
                        {item['subnew']}
                      </span>
                    }
                    {
                      <span style={{fontSize:'10px',float:'right'}}  className={`${item['netChangeRatio'] > 0? 'under': 'upper'}`}>
                        {item['tradflag']}
                      </span>
                    }
                  </div>
                </div>
                <div className={`${item['netChangeRatio'] > 0? 'under': 'upper'}`} style={{marginRight:'15px'}}>
                  <span className={this.preRenderData && this.updateColor(this.preRenderData[type][index].close, item.close)}>
                    {transfromData({data: item['close'], uuid: item.stockBasic.uuid})}
                  </span>
                </div>
                <div className={`${item[showName] > 0? 'under': 'upper'}`}>
                  <span className={this.preRenderData && this.updateColor(this.preRenderData[type][index][showName], item[showName])}>
                    {transfromData({data: item[showName], uuid: item.stockBasic.uuid})}%
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  //渲染单个列表
  render(){
    console.log('change组件渲染次数', this.compId, this.renderTime);
    let renderData = this.props.data[this.props.actionName];
    this.clearColorClass();
    return (
      <div
        className='changeOrigin'
        id={this.compId}
        data-actionname={this.props.actionName}
        style={this.props.style}>
        <div className="changeBox">
          <h2 className='title'>{this.props.changeProps.title} 涨跌幅</h2>
          <div className="content">
            {
              renderData && [
                this.renderItem('netChangeRatioUpperRank', 'netChangeRatio', 0),
                this.renderItem('netChangeRatioDownRank', 'netChangeRatio', 0)
              ] ||  <LoadOrigin />
            }
          </div>
        </div>
        <div className="changeBox">
          <h2 className='title'>{this.props.changeProps.title} 涨跌速</h2>
          <div className="content">
            {
              renderData && [
                this.renderItem('speedRatioUpperRank', 'speedRatio', 4),
                this.renderItem('speedRatioDownRank', 'speedRatio', 4)
              ] || <LoadOrigin />
            }
          </div>
        </div>
      </div>
    )
  }
}

ChangeOrigin.propTypes = {
  showNum: PropTypes.number.isRequired,
}

ChangeOrigin.defaultProps = {
  showNum: 5
}

export default connect(
  state => ({data: state.Data}), {controller}
)(ChangeOrigin);

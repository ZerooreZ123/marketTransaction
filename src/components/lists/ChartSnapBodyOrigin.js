import React, { Component } from 'react';
import {connect} from 'react-redux';
import './ChartOrigin.less';

import { CompBaseClass } from "@/utils/BaseTools.js";
import _cloneDeep from 'lodash/cloneDeep';

class ChartSnapBodyOrigin extends CompBaseClass{
  constructor(props){
    super(props);
    this.ChartSnapBodyObj = {
        'SZ.399001':'SZ.399106',
        'SZ.399005':'SZ.399101',
        'SZ.399006':'SZ.399102',
      }
  }

  componentDidMount() {
    let [symbol, dataType] = this.props.actionName.split('-');

    if(this.ChartSnapBodyObj[symbol]){
      this.emitEvent([{symbol:this.ChartSnapBodyObj[symbol],dataType: dataType},{symbol,dataType: dataType}]);
    }else{
      this.emitEvent([{symbol,dataType: dataType}]);
    }
  }

  componentWillUnmount() {
    let [symbol, dataType] = this.props.actionName.split('-');
    this.unemitEvent();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.actionName !== this.props.actionName){
      let [symbol, dataType] = this.props.actionName.split('-');
      let [nextsymbol, nextdataType] = nextProps.actionName.split('-');
      this.emitEvent([{'symbol':nextsymbol,'dataType': nextdataType}]);
      this.unemitEvent(this.props.actionName);
    }
  }

  kCreatDom(dataType,IndexStatData){
    var _label;
    _label = IndexStatData.netChangeRatio > 0?"▲": IndexStatData.netChangeRatio < 0?"▼" : '';
    // if(IndexStatData.stockCode === '002751')debugger
    switch(dataType){
      case '17':
        return (
          <div>
            <span><label>{IndexStatData.stockName}</label></span>
            <span className={IndexStatData.netChangeRatio > 0? 'under': 'upper'}>{IndexStatData.close}</span>
            <span className={IndexStatData.netChangeRatio > 0? 'under': 'upper'}>{IndexStatData.netChange}</span>
            <span className={IndexStatData.netChangeRatio > 0? 'under': 'upper'}>{_label +(IndexStatData.netChangeRatio * 1).toFixed(2) + '%'}</span>
            <span className='under'><label>涨家</label>
              {
               ( this.props.data[this.props.actionName] && this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] &&this.props.data[this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] + '-17'])
               && this.props.data[this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] + '-17'].riseNum
                || IndexStatData.riseNum
              // this.props.data['SZ.399106-17'] && IndexStatData.stockBasic.uuid === 'SZ.399001' && this.props.data['SZ.399106-17'].riseNum ||IndexStatData.riseNum
              }
              </span>
            <span className='upper'><label>跌家</label>
              {
               ( this.props.data[this.props.actionName] && this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] &&this.props.data[this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] + '-17'])
               && this.props.data[this.ChartSnapBodyObj[IndexStatData.stockBasic.uuid] + '-17'].fallNum
               || IndexStatData.fallNum
                // this.props.data['SZ.399106-17'] && IndexStatData.stockBasic.uuid === 'SZ.399001' && this.props.data['SZ.399106-17'].fallNum ||IndexStatData.fallNum

              }
            </span>
          </div>
        )
      case '6':
        return (
          <div>
            <span><label>{IndexStatData.stockName}</label></span>
            {
              IndexStatData.stockBasic.stockStatus === 0 
              && <span className='under'>停牌中...</span>
            }
            <span className={IndexStatData.netChangeRatio > 0? 'under' :IndexStatData.netChangeRatio < 0? 'upper' : 'zero'}>{IndexStatData.close}</span>
            {
              IndexStatData.stockBasic.stockStatus !== 0 
              &&  <span className={IndexStatData.netChangeRatio > 0? 'under' :IndexStatData.netChangeRatio < 0? 'upper' : 'zero'}>{IndexStatData.netChange}</span>
            }
           
            <span className={IndexStatData.netChangeRatio > 0? 'under' :IndexStatData.netChangeRatio < 0? 'upper' : 'zero'}>{typeof(IndexStatData.netChangeRatio) === 'string' ? '--' :_label + (IndexStatData.netChangeRatio * 1).toFixed(2) + '%'}</span>
            {
              IndexStatData.stockBasic.stockStatus !== 0 
               &&  IndexStatData.stockBasic.asset === 0 
               &&
              <span>
                <span className={IndexStatData.netChangeRatio > 0? 'under' :IndexStatData.netChangeRatio < 0? 'upper' : 'zero'}><label>现量</label>{IndexStatData.nowVolume}</span>
                <span className={IndexStatData.netChangeRatio > 0? 'under' :IndexStatData.netChangeRatio < 0? 'upper' : 'zero'}><label>换手</label>{(IndexStatData.turnoverRatio *1).toFixed(2) + '%'}</span>
              </span>
            }
            {
               IndexStatData.stockBasic.stockStatus !== 0 
               &&  IndexStatData.stockBasic.asset === 4 
               &&
              <span>
                <span className='under'><label>涨家</label>{IndexStatData.RiseVolume}</span>
                <span className='upper'><label>跌家</label>{IndexStatData.FallVolume}</span>
              </span>
            }
            
          </div>
        )
    }
  }
  fCreatDom(dataType,IndexStatData){
    return (
      <div>
        <span><label>{IndexStatData.stockName}(日线)</label></span>
      </div>
    )
  }
  getChartTitle (dataType,IndexStatData){
    if(this.props.chartType === 'fk'){
      if(this.props.activeIndex === 0){
        return this.kCreatDom(dataType,IndexStatData)
      }else{
        return this.fCreatDom(dataType,IndexStatData)
      }
    }else if(this.props.chartType === 'f'){
      return this.kCreatDom(dataType,IndexStatData)
    }else{
      return this.fCreatDom(dataType,IndexStatData)
    }
  }

  render(){
    console.log('chartTitle组件渲染次数', this.compId, this.renderTime);
    let renderData = this.props.data[this.props.actionName];
    if(renderData && renderData.constructor === Array && renderData.length > 0)renderData = renderData[0];
    let [symbol, dataType] = this.props.actionName.split('-');
    return (
      <div
        className="indexStat"
        data-actionname={this.props.actionName}
        id={this.compId}>
        <div style={{width:"100%",height:"100%"}}>
          { renderData && this.getChartTitle(dataType, renderData) }
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({data: state.Data})
)(ChartSnapBodyOrigin);

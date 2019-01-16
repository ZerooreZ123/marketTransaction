import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CompBaseClass } from "@/utils/BaseTools.js";
import _cloneDeep from 'lodash/cloneDeep';
// import {bindActionCreators} from 'redux';
// import { connect } from 'react-redux';
import {formTime} from '@/utils/FormatUtils'
import LoadOrigin from '@/components/lists/LoadOrigin';
import './index.less'

class FivePriceList2 extends CompBaseClass{
  constructor(props){
    super(props);
  }

  sendData(props){
    let [symbol, dataType] = props.actionName.split('-');
    // console.log(symbol, dataType, indexstatdataType)
    this.emitEvent([{symbol:symbol, dataType:dataType}]);
  }

  componentDidMount() {
    this.sendData(this.props)
  }

  componentWillUnmount() {
    let [symbol, dataType] = this.props.actionName.split('-');
    this.unemitEvent();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.actionName !== this.props.actionName){
      this.sendData(nextProps);
      this.unemitEvent(this.props.actionName)
    }
  }

  render(){
    let _actionName = this.props.actionName;
    let SnapShotData = this.props.data[_actionName];
    if(SnapShotData){
      SnapShotData.time =  formTime(SnapShotData.time)
    }

    return (
      <div className='fivePriceList'>
        {
          SnapShotData
            &&
            <div>
              <div className="fiveTop">
                <div>
                  <h2 className="stockName">{SnapShotData.stockBasic.stockName}<span className="stockCode">{SnapShotData.stockBasic.stockCode}</span></h2>
                </div>
                <div className="lineHight30">
                  <span className="upTime">{SnapShotData.time}更新</span>
                  <span className="nowPrice"  className={SnapShotData.netChangeRatio > 0? 'nowPrice under ': 'nowPrice upper '}>{SnapShotData.close}</span>
                  <span className="nowPriceB"  className={SnapShotData.netChangeRatio > 0? 'nowPriceB under': 'nowPriceB upper'}>{SnapShotData.netChangeRatio}%</span>
                  <span className="nowPriceF"  className={SnapShotData.netChangeRatio > 0? 'nowPriceF under': 'nowPriceF upper'}>{SnapShotData.netChange}</span>
                </div>

              </div>
            </div>
            ||
            <LoadOrigin />
        }
      </div>
    )
  }
}
export default connect(
  state => ({data: state.Data})
)(FivePriceList2);

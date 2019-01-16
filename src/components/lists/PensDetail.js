import React, { Component } from 'react';
import { CompBaseClass } from "@/utils/BaseTools.js";
import { connect } from 'react-redux';
import './PensDetail.less'
import _cloneDeep from 'lodash/cloneDeep';
import { controller } from '@/actions';
import _isEqual from 'lodash/isEqual';
import _round from "lodash/round";
import LoadOrigin from '@/components/lists/LoadOrigin';
import CalcWidthAndHeight from '@/components/highOrder/CalcWidthAndHeight';
import { Icon } from 'antd';
import { unitConvert } from '@/utils/FormatUtils';

class PensDetail extends CompBaseClass {
  constructor(props) {
    super(props);
    this.windowHeight = '';
    if (props.isShowQuoteDetails) {
      this.stockInfo = props.quoteDetailsData;
    } else {
      this.stockInfo = window.currentSelectItem;
    }
    this.symbol = this.stockInfo.uuid;
    this.asset = this.stockInfo.asset;
    this.dataType = 4;
    this.actionName = `${this.symbol}-${this.dataType}`;
    this.oneItemWidth = 205;
    this.oneItemHeight = 21;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.shouldComponentUpdateHandle(nextProps, nextState, this.actionName);
  }

  componentDidMount() {
    this.emitEvent([{ symbol: this.symbol, dataType: this.dataType, length: '-1' }])
  }

  componentWillUnmount() {
    this.unemitEvent();
  }

  render() {
    console.log('PensDetail 渲染次数: ', this.renderTime);
    this.oneItemHeight = 21;
    let pensHeight = 0;
    let pensWidth = 0;
    let dataNum = 0;//一列显示条数
    let rowNum = 0;//多少列
    const renderData = this.props.data[this.actionName] || [];
    pensHeight = document.getElementById('root').clientHeight - 28 * 2 - 7;
    pensWidth = document.getElementById('root').clientWidth;
    if (this.isLegal(renderData)) {
      dataNum = parseInt(pensHeight / this.oneItemHeight);//一列显示条数
      this.oneItemHeight = _round(pensHeight / dataNum, 2) - 0.1;
      rowNum = Math.ceil(renderData.length / dataNum);//多少列
    }

    return (
      <div className='pensContent' data-actionname={this.actionName} id={this.compId}>
        <div className="pensContentTop">
          <span onClick={e => this.props.controller({ isShowPensDetail: false })}><Icon type="rollback" theme="outlined" />返回</span>
          <div className="stockInfo">{this.stockInfo.stockName}({this.symbol})</div>
        </div>
        {
          renderData.length > 0 && (
            <div className="pensContentMiddle">
              <div className="pensDetailListTop">
                <div className="countTitle" style={{ width: rowNum * this.oneItemWidth + 'px' }}>
                  {(new Array(rowNum)).fill(0).map((_, index) => {
                    return (
                      <ul key={index}>
                        <li>时间</li>
                        <li>价格</li>
                        <li>成交</li>
                      </ul>
                    )
                  })}
                </div>
              </div>
              <div className="pensDetailList" style={{ width: rowNum * this.oneItemWidth + 'px' }}>
                <div className="countMain">
                  {
                    this.isLegal(renderData) && [...renderData].reverse().map((item, index) => {
                      return (
                        <div className='itemList' key={index} style={{ height: this.oneItemHeight + 'px' }}>
                          <span>{item.date}</span>
                          <span>{item.price}</span>
                          <span>
                            <label className="yellow">{unitConvert(item.volume, 1, 0)}</label>
                            <label className={`${item['bsflag'] == 'B' ? 'under' : 'upper'}`}>{item.bsflag}</label>
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {
                (new Array(rowNum + 1)).fill(0).map((tmp, index) => {
                  return (
                    <div className="rowLine" style={{ left: `${index * this.oneItemWidth}px` }}></div>
                  )
                })
              }
            </div>
          ) || <LoadOrigin />
        }
      </div>
    )
  }
}
export default connect(
  state => ({
    data: state.Data,
    isShowQuoteDetails: state.DisplayController.isShowQuoteDetails,
    quoteDetailsData: state.DisplayController.quoteDetailsData,
  }), { controller }
)(CalcWidthAndHeight(PensDetail));

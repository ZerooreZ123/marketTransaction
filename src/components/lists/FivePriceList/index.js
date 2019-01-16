import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CompBaseClass } from "@/utils/BaseTools.js";
import { Spin, Alert } from 'antd';
import _cloneDeep from 'lodash/cloneDeep';
// import {bindActionCreators} from 'redux';
// import { connect } from 'react-redux';
import { unitConvert } from '@/utils/FormatUtils'
import LoadOrigin from '@/components/lists/LoadOrigin';
import { SmallCompOrigin, SmallCompOriginByEmit } from '@/components/lists/SmallCompOrigin';
import './index.less'


// 成交量成交额 com
const ChartSnapBodyObj = {
    'SZ.399001': 'SZ.399106',
    'SZ.399005': 'SZ.399101',
    'SZ.399006': 'SZ.399102',
}

class FivePriceList extends CompBaseClass {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let [symbol, dataType] = this.props.actionName.split('-');
        // console.log(symbol, dataType, indexstatdataType)
        this.emitEvent([{ symbol: symbol, dataType: dataType }]);
        if (ChartSnapBodyObj[symbol]) {
            this.emitEvent([{ symbol: ChartSnapBodyObj[symbol], dataType: dataType }, { symbol, dataType: dataType }]);
        } else {
            this.emitEvent([{ symbol, dataType: dataType }]);
        }
        if(this.props.asset === 4){
          this.emitEvent([{ symbol, dataType: '17' }]);
        }

    }
    componentWillUnmount() {
        let [symbol, dataType] = this.props.actionName.split('-');
        this.unemitEvent();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.actionName !== this.props.actionName) {
            let [symbol, dataType] = this.props.actionName.split('-');
            let [nextsymbol, nextdataType] = nextProps.actionName.split('-');
            this.emitEvent([{ 'symbol': nextsymbol, 'dataType': nextdataType }]);
            this.unemitEvent(this.props.actionName);
        }
    }
    render() {
        let _actionName = this.props.actionName;
        let [symbol, dataType] = this.props.actionName.split('-');
        let SnapShotData = this.props.data[_actionName];
        let action;
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
                                <span className={`nowPrice${SnapShotData.close > SnapShotData.preClose  ? ' under ' :SnapShotData.close < SnapShotData.preClose ? 'upper ': ''}`}>{SnapShotData.close}</span>
                                <span className={`nowPriceB${SnapShotData.netChangeRatio > 0  ? ' under ' :SnapShotData.netChangeRatio < 0 ? 'upper ': ''}`}>{(SnapShotData.netChangeRatio).toFixed(2)}%</span>
                                <span className={`nowPriceF${SnapShotData.netChangeRatio > 0  ? ' under ' :SnapShotData.netChangeRatio < 0 ? 'upper ': ''}`}>{SnapShotData.netChange}</span>
                            </div>
                            <div className="stockEntrust">
                                <div className="entrustData"><span>委比</span><span className={`${SnapShotData.netChangeRatio > 0  ? ' under ' :SnapShotData.netChangeRatio < 0 ? 'upper ': ''}`}>{SnapShotData.weibiRatio}</span></div>
                            </div>

                        </div>
                        {
                            SnapShotData.ask.length > 0 && (
                                <ul className='sellList'>
                                    {
                                        SnapShotData.ask.map((item, index) => {
                                            return (
                                              index > 4 && 
                                              <li>
                                                <span>{item.asktext}</span>
                                                <span className={item.price > SnapShotData.preClose ? 'under' : item.price < SnapShotData.preClose ? 'upper' : ''}>{item.price == 0 ? ' ' : item.price}</span>
                                                <span>{item.price == 0 ? ' ' : item.volume}</span>
                                              </li>
                                            )
                                        })
                                    }
                                </ul>
                            )
                        }
                        {
                            SnapShotData.bid.length > 0 && (
                                <ul className='buyList'>
                                    {
                                        SnapShotData.bid.map((item, index) => {
                                            return (
                                                index < 5 && <li><span>{item.asktext}</span><span className={item.price > SnapShotData.preClose ? 'under' : item.price < SnapShotData.preClose ? 'upper' : ''}>{item.price == 0 ? ' ' : item.price}</span><span>{item.price == 0 ? ' ' : item.volume}</span></li>
                                            )
                                        })
                                    }
                                </ul>
                            )
                        }
                        {
                            (
                                <div>
                                    <ul className='priceList'>
                                        <li><span>今开</span><span className={SnapShotData.open > SnapShotData.preClose ? 'under' : SnapShotData.open < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.open == 0 ? ' ' : SnapShotData.open}</span><span>昨收</span><span>{SnapShotData.preClose == 0 ? ' ' : SnapShotData.preClose}</span></li>
                                        <li><span >最高</span><span className={SnapShotData.high > SnapShotData.preClose ? 'under' : SnapShotData.high < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.high == 0 ? ' ' : SnapShotData.high}</span><span >最低</span><span className={SnapShotData.low > SnapShotData.preClose ? 'under' : SnapShotData.low < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.low == 0 ? ' ' : SnapShotData.low}</span></li>
                                        <li><span>换手</span><span>{SnapShotData.turnoverRatio == 0 ? '0.00%' : SnapShotData.turnoverRatio + '%'}</span><span>振幅</span><span>{SnapShotData.amplitudeRatio == 0 ? ' ' : SnapShotData.amplitudeRatio + '%'}</span></li>
                                    </ul>
                                    {
                                        this.props.actionPage !== "optionStock" && (
                                            <ul className='priceList' style={{ borderTop: 0, paddingTop: 0 }}>
                                                {
                                                  this.props.asset !== 4 && (
                                                    <li><span>均价</span><span className={SnapShotData.open > SnapShotData.preClose ? 'under' : SnapShotData.open < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.avgPrice == 0 ? ' ' : SnapShotData.avgPrice}</span><span></span><span></span></li>
                                                  )
                                                }
                                                {
                                                  this.props.asset !== 4 && (
                                                    <li><span>外盘</span><span className={SnapShotData.open > SnapShotData.preClose ? 'under' : SnapShotData.open < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.outside == 0 ? ' ' : SnapShotData.outside}</span><span>内盘</span><span className={SnapShotData.open > SnapShotData.preClose ? 'under' : SnapShotData.open < SnapShotData.preClose ? 'upper' : ''}>{SnapShotData.inside == 0 ? ' ' : SnapShotData.inside}</span></li>
                                                  )
                                                }

                                                {
                                                  (action = ChartSnapBodyObj[symbol]? `${ChartSnapBodyObj[symbol]}-5`: `${symbol}-5`, (
                                                    <li>
                                                        <span>成交量</span>
                                                        <span>
                                                          <SmallCompOrigin
                                                            actionName={action}
                                                            type='volume'
                                                            parseFun={data => parseFloat(data) === 0? '': unitConvert(data, 1, 2)}
                                                          />
                                                        </span>
                                                        <span>成交额</span>
                                                        <span>
                                                          <SmallCompOrigin
                                                            actionName={action}
                                                            type='amount'
                                                            parseFun={data => parseFloat(data) === 0? '': unitConvert(data, 1, 2)}
                                                          />
                                                        </span>
                                                    </li>
                                                  ))
                                                }
                                                {
                                                  this.props.asset !== 4 && (
                                                    <li><span>市净率</span><span>{SnapShotData.bvRatio == 0 ? ' ' : SnapShotData.bvRatio + '%'}</span><span>市盈率</span><span>{SnapShotData.peratio== 0 ? ' ' : (SnapShotData.peratio).toFixed(2) + '%'}</span></li>
                                                  )
                                                }

                                                {
                                                  this.props.asset === 4 && (
                                                    <li>
                                                      <span>上涨</span>
                                                      <span className='under'>
                                                        <SmallCompOriginByEmit
                                                          actionName={symbol + '-17'}
                                                          type='riseNum'
                                                          parseFun={data => data === 0? '': unitConvert(data, 1, 0)}
                                                        />
                                                      </span>
                                                      <span>下跌</span>
                                                      <span className='upper'>
                                                        <SmallCompOriginByEmit
                                                          actionName={symbol + '-17'}
                                                          type='fallNum'
                                                          parseFun={data => data === 0? '': unitConvert(data, 1, 0)}
                                                        />
                                                      </span>
                                                    </li>
                                                  )
                                                }

                                            </ul>
                                        )
                                    }
                                </div>
                            )

                            // 今开、昨收、最高、最低、成交量、成交额、换手、振幅、上涨、下跌
                            // ||
                            // (
                            //     <div>
                            //         <ul className='priceList priceList2'>
                            //             <li><span>今开</span><span className={SnapShotData.open >  SnapShotData.preClose? 'under': SnapShotData.open <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.open}</span></li>
                            //             <li><span>昨收</span><span>{SnapShotData.preClose}</span></li>
                            //             <li><span >最高</span><span className={SnapShotData.high >  SnapShotData.preClose? 'under': SnapShotData.high <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.high}</span></li>
                            //             <li><span >最低</span><span className={SnapShotData.low >  SnapShotData.preClose? 'under': SnapShotData.low <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.low}</span></li>
                            //             <li><span>换手</span><span>{SnapShotData.turnoverRatio}</span></li>
                            //             <li><span>振幅</span><span>{SnapShotData.amplitudeRatio}</span></li>
                            //             <li><span>均价</span><span className={SnapShotData.open >  SnapShotData.preClose? 'under': SnapShotData.open <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.avgPrice}</span></li>
                            //             <li><span>外盘</span><span className={SnapShotData.open >  SnapShotData.preClose? 'under': SnapShotData.open <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.outside}</span></li>
                            //             <li><span>内盘</span><span className={SnapShotData.open >  SnapShotData.preClose? 'under': SnapShotData.open <  SnapShotData.preClose? 'upper' : ''}>{SnapShotData.inside}</span></li>
                            //             <li><span>成交量</span><span>{unitConvert(SnapShotData.volume)}</span></li>
                            //             <li><span>成交额</span><span>{unitConvert(SnapShotData.amount)}</span></li>
                            //             <li><span>市净率</span><span>{SnapShotData.bvRatio}</span></li>
                            //             <li><span>市盈率</span><span>{(SnapShotData.peratio).toFixed(2)}</span></li>
                            //         </ul>

                            //     </div>
                            // )
                        }


                    </div>
                    ||
                    // <div className="loadingSpin"><Spin tip="加载中..."></Spin></div>
                    <LoadOrigin />

                }

            </div>
        )
    }
}
export default connect(
    state => ({ data: state.Data })
)(FivePriceList);

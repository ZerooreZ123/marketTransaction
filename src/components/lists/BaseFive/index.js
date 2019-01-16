import React, { Component } from 'react';
import { CompBaseClass } from "@/utils/BaseTools.js";
import './index.less'
const stockInfo = {
    name:'广发银行',


}
class BaseFive extends CompBaseClass{
    constructor(props){
        super(props);
        debugger;
    }
    sendData(props){
        let [symbol, dataType] = props.actionName.split('-');
        // console.log(symbol, dataType, indexstatdataType)
        this.emitEvent([{symbol:symbol, dataType:dataType}]); 
      }

    componentDidMount() {
        this.sendData(this.props)
        debugger
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
        return (
            <div className='fivePriceMain'>
                <div className="fiveTop">
                    <h2 className="stockName">广发银行<span className="stockCode">002122</span></h2>
                    <div className="lineHight30">
                        <span className="upTime">15:04更新</span> <span className="nowPrice">15.62</span><span className="nowPriceB">-0.15%</span> <span className="nowPriceF">-0.08</span> 
                    </div>
                    <div className="stockEntrust">
                        <div className="entrustData"><span>委比</span><span className="red">5.15%</span></div>
                        <div className="entrustData"><span>委差</span><span className="red">541</span></div> 
                    </div>
                </div>
                <ul className='sellList'>
                   <li><span>卖五</span><span className="red">12.22</span><span>12.33</span></li>
                   <li><span>卖四</span><span className="green">12.22</span><span>12.33</span></li>
                   <li><span>卖三</span><span className="green">12.22</span><span>12.33</span></li>
                   <li><span>卖二</span><span className="red">12.22</span><span>12.33</span></li>
                   <li><span>卖一</span><span className="red">12.22</span><span>12.33</span></li>
                </ul>
                <ul className='buyList'>
                    <li><span>卖五</span><span className="green">12.22</span><span>12.33</span></li>
                    <li><span>卖四</span><span className="red">12.22</span><span>12.33</span></li>
                    <li><span>卖三</span><span className="green">12.22</span><span>12.33</span></li>
                    <li><span>卖二</span><span className="green">12.22</span><span>12.33</span></li>
                    <li><span>卖一</span><span className="red">12.22</span><span>12.33</span></li>
                </ul>
                <ul className='priceList'>
                    <li><span>今开</span><span className="red">12.22</span><span>均价</span><span>12.22</span></li>
                    <li><span>最高</span><span className="red">-12.22</span><span>量比</span><span className="green">12.22</span></li>
                    <li><span>最低</span><span className="green">12.22</span><span>市值A</span><span className="red">12.22</span></li>
                    <li><span>现量</span><span className="red">-12.22</span><span>总量</span><span className="green">12.22</span></li>
                    <li><span>外盘</span><span className="green">12.22</span><span>内盘</span><span className="red">12.22</span></li>
                    <li><span>换手</span><span className="red">-12.22</span><span>股本</span><span className="green">12.22</span></li>
                    <li><span>净资</span><span className="green">12.22</span><span>流通</span><span className="red">12.22</span></li>
                    <li><span>收益</span><span className="red">-12.22</span><span>PE</span><span className="green">12.22</span></li>
                </ul>
            </div>
        )
    }
}
export default BaseFive;

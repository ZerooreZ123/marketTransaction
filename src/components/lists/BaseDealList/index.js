import React, { Component } from 'react';
import { CompBaseClass } from "@/utils/BaseTools.js";
import {connect} from 'react-redux';
import { Spin, Alert} from 'antd';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import './index.less'
import {controller} from '@/actions/';
class BaseDealList extends CompBaseClass{
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0,
      oensDetailShow:false
    }
    this.initActionName = [0, 1];
  }

  tabs3 = [
    {tabName: "笔",dataType:"4", props: {length :'50'}},
    {tabName: "价",dataType:"14"},
    {tabName: "细",dataType:""},
    // {tabName: "势"},
    // {tabName: "势"},
    // {tabName: "联"},
    // {tabName: "值"},
    // {tabName: "主"},
    // {tabName: "筹"},
  ]

  sendData(props){
    let temp = [];
    this.initActionName.forEach((index) =>{
      let tmpData = {
        symbol:this.props.actionUuid,
        dataType:this.tabs3[index].dataType,
      };
      this.tabs3[index].props && (tmpData = {...tmpData, ...this.tabs3[index].props});
      temp.push(tmpData);
    })
    this.emitEvent(temp)
  }

  componentDidMount() {
    this.sendData(this.props)
  }
  componentWillUnmount() {
    this.unemitEvent();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.actionName !== this.props.actionName ){
      this.sendData(nextProps);
      this.unemitEvent(this.props.actionName)
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(_isEqual(nextProps.data[`${this.props.actionUuid}-${this.tabs3[this.state.currentIndex].dataType}`], this.renderData) && _isEqual(this.state, nextState)){
      return false;
    }
    this.renderTime += 1;
    return true;
  }

  pensDetailClick(){
    this.props.controller({isShowPensDetail: true});
  }

  render(){
    this.renderData = _cloneDeep(this.props.data[`${this.props.actionUuid}-${this.tabs3[this.state.currentIndex].dataType}`]);
    return (
      <div className='fivePriceMain'>
        {
          this.state.currentIndex === 0 && this.renderData &&
            (
              <ul className='buyList baseList flex1'>
                {
                  this.renderData.reverse().slice(0,50).map((item ,index) => {
                    return (
                      <li key={index} onClick={e => this.pensDetailClick()}>
                        {/* <li key={index}> */}
                          <span>{item.date}</span>
                          <span>{item.price}</span>
                          <span>
                            <label className="yellow">{item.volume}</label>
                            <label style={{marginLeft:'10px'}} className={`${item['bsflag'] == 'B' ? 'under' :'upper'}`}>{item.bsflag}</label>
                          </span>


                        </li>
                    )
                  })
                }
              </ul>
            )
        }
        {
          this.state.currentIndex === 1 && this.renderData &&
            (
              <ul className='buyList flex1'>
                {
                  this.renderData.fence.map((item ,index) => {
                    return (
                      <li key={index}>
                        <span>{item.price}</span>
                        <span className='yellow'>{item.volume}</span>
                        {
                          <div className="barHeight" style={{width:'100px'}}>
                            <div style={{width:item.volumeWidth + '%'}}>
                              <div className='Bunder' style={{width:item.askWidth + '%'}}></div>
                              <div className='Bupper' style={{width:item.bidWidth + '%'}}></div>
                            </div>
                          </div>
                        }
                        <span>{parseInt(item.percent * 100)}%</span>
                      </li>
                    )
                  })
                }
              </ul>
            )
        }
        {
          this.state.currentIndex === 2 &&
            (
              <ul className='buyList flex1'>
                <li><span style={{textAlign:'center'}}>逐笔成交明细需要开通Level2行情</span></li>

              </ul>
            )
        }

        <div className="chartMain">
          {
            this.tabs3.map((res, index) => {
              return (
                <div
                  key={index}
                  onClick={() => this.setState({currentIndex: index})}
                  className={index === this.state.currentIndex? 'subCtrl active': 'subCtrl'}
                >
                  {res.tabName}
                </div>
              )
            })
          }
        </div>
      </div>

    )
  }
}
export default connect(
  state => ({data: state.Data}), {controller}
)(BaseDealList);

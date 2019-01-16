/*
 * 行情的详情页
 */
import React, { Component } from 'react';
import { Tabs, Icon } from 'antd'
import { CompBaseClass } from "@/utils/BaseTools.js";
import {controller} from '@/actions/';
import { connect } from 'react-redux';
import './index.less'
import FivePriceList from '@/components/lists/FivePriceList';
import FivePriceList2 from '@/components/lists/FivePriceList2';
import BaseDealList from '@/components/lists/BaseDealList';
import GlbjOrigin from '@/components/lists/GlbjOrigin';
import ZjlxOrigin from '@/components/lists/ZjlxOrigin';
import CompGenerater from '@/components/modules/CompGenerater';
import KlineChart from '@/components/modules/KlineChart';
import { width, height } from 'window-size';

class QuoteDetails extends CompBaseClass {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      currentIndex2: 0,
      historyStore: [props.quoteDetailsData],
    }

  }
  tabs2 = [
    { tabName: "公司资讯" },
    // {tabName: "关联报价"},
    // {tabName: "资金流向"},
  ]

  tabs3 = [
    { tabName: "涨幅榜", defaultSort: "netChangeRatio_desc" },
    { tabName: "跌幅榜", defaultSort: "netChangeRatio_asc" },
    { tabName: "换手榜", defaultSort: "turnoverRatio_desc" },
    // {tabName: "势"},
    // {tabName: "势"},
    // {tabName: "联"},
    // {tabName: "值"},
    // {tabName: "主"},
    // {tabName: "筹"},
  ]

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quoteDetailsData.uuid !== this.props.quoteDetailsData.uuid) {
      if (this.state.historyStore.findIndex(item => item.uuid === nextProps.quoteDetailsData.uuid) === -1) {
        this.setState(prev => {
          prev.historyStore.push(nextProps.quoteDetailsData);
          return prev
        })
      } else {
        this.setState({});
      }
    }
  }

  onChange(index) {
    this.setState({ currentIndex2: parseInt(index) });
  }

  render() {
    return this.state.historyStore.map(item => item.uuid === this.props.quoteDetailsData.uuid ? this.getRender(item.uuid) : '');
  }

  getRender(uuid) {
    console.log('详情页渲染次数: ', this.renderTime);
    console.log(this.props.quoteDetailsData.uuid)
    return (
      <div ref="mainBox" key={uuid}
        className='quoteDetails zoomIn myAnimated'>
        <div className='detailsLeft' style={{width : this.props.isShowChartModelRight ? ' calc(100% - 334px)' : '100%'}}>
          <div className="detailsLeftTop" style={{height: this.props.isShowChartModelBottom ? '66.6%' : 'calc(100% - 28px)'}}>
            <div className="content">
              <KlineChart sign={`${this.props.isShowChartModelRight}${this.props.isShowChartModelBottom}`}/>
            </div>
          </div>
          <div className="detailsLeftBottom" style={{height: this.props.isShowChartModelBottom ? '33.3%' : '28px'}}>
          <span className="iconMain">
          {
            this.props.isShowChartModelBottom 
            && <Icon type="down-square" theme="outlined"  onClick={(e) =>  this.props.controller({isShowChartModelBottom: false})}/>
            || <Icon type="up-square" theme="outlined"  onClick={(e) =>  this.props.controller({isShowChartModelBottom: true})}/>
          }
          </span>
            <Tabs
              clssName='myTabList'
              tabPosition='bottom'
              onChange={(index) => this.onChange(index)}
              renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} onKeyDown={e => e}/>}
              type='card'>
              <Tabs.TabPane tab="公司资讯" key="1">
                <div className="bottomContent">
                  <div className="newsMain">
                    <CompGenerater name='DetailNewsLeft' asset={this.props.quoteDetailsData.asset} actionStock={this.props.quoteDetailsData.exchange + '/' + this.props.quoteDetailsData.stockCode} />
                  </div>
                  <div className="newsMain">
                    <CompGenerater name='DetailNewsRight' asset={this.props.quoteDetailsData.asset} actionStock={this.props.quoteDetailsData.exchange + '/' + this.props.quoteDetailsData.stockCode} />
                  </div>
                </div>
              </Tabs.TabPane>
              {
                this.props.quoteDetailsData.asset !== 4 && this.props.quoteDetailsData.asset !== 5 && this.props.quoteDetailsData.asset !== 6 &&(
                  <Tabs.TabPane tab="关联报价" key="2">
                    <div className='glbjContent'>
                      <GlbjOrigin />
                    </div>
                  </Tabs.TabPane>
                )
              }
              {
                this.props.quoteDetailsData.asset !== 4 && (
                  <Tabs.TabPane tab="资金流向" key="3">
                    <ZjlxOrigin />
                  </Tabs.TabPane>
                )
              }


            </Tabs>
            
            {/* <div className="bottomContent">
              <div className="newsMain">
                <CompGenerater name='DetailNewsLeft' asset={this.props.quoteDetailsData.asset} actionStock={this.props.quoteDetailsData.exchange + '/' +this.props.quoteDetailsData.stockCode}/>
              </div>
              <div className="newsMain">
                <CompGenerater name='DetailNewsRight' asset={this.props.quoteDetailsData.asset} actionStock={this.props.quoteDetailsData.exchange + '/' +this.props.quoteDetailsData.stockCode}/>
              </div>
            </div>
            <div className="chartMain">
              {
                this.tabs2.map((res, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => this.setState({currentIndex2: index})}
                      className={index === this.state.currentIndex2? 'subCtrl active': 'subCtrl'}
                    >
                      {res.tabName}
                    </div>
                  )
                })
              }
            </div> */}
          </div>
        </div>
        {
          this.props.isShowChartModelRight && <div className="detailsRight">
          <div className="fiveMain" className={`${this.props.quoteDetailsData.asset !== 4 ? 'heightGP' : this.props.quoteDetailsData.exchange === 'INDEX' ? 'heightBK' : 'heightZS'}`}>
            {
              this.props.quoteDetailsData.exchange === 'INDEX' && (
                <FivePriceList2 actionName={this.props.quoteDetailsData.uuid + '-6'} />
              )
              ||
              (
                <FivePriceList actionName={this.props.quoteDetailsData.uuid + '-5'} asset={this.props.quoteDetailsData.asset} />
              )
            }

          </div>
          <div className="dealMain">
            <div className={`${this.props.quoteDetailsData.asset !== 4 ? 'isHide' : 'isShow'}`}>
              <div className='chartMain1' >
                {
                  this.tabs3.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.setState({ currentIndex: index })}
                        className={index === this.state.currentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res.tabName}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            {
              this.props.quoteDetailsData && this.tabs3.map((item, index) => {
                if (index === this.state.currentIndex) {
                  if (this.props.quoteDetailsData.asset === 4) {
                    let name;
                    if (index === 2) {
                      name = 'DetailTableZSHs';
                    } else {
                      name = 'DetailTableZS';
                    }
                    return (
                      <div className="tableOutDiv" key={name + index} >
                        <CompGenerater name={name}
                          actionName={this.props.quoteDetailsData.uuid + '-19'}
                          tableProps={{
                            defaultSort: item['defaultSort'],
                            onRow: {
                              onChangeHandle: ({ data, index, dataIndex }) => {
                                this.setState({ chartTwoActionName: [data.uuid + '-7-6'] })
                              }
                            }
                          }}
                        />
                      </div>
                    )
                  } else {
                    return (
                      <BaseDealList key={name + index} actionUuid={this.props.quoteDetailsData.uuid} />
                    )

                  }
                } else {
                  return '';
                }
              })
            }
          </div>
        </div>
        }
       
      </div>
    )
  }
}

// export default QuoteDetails;
export default connect(
  state => ({ 
    quoteDetailsData: state.DisplayController.quoteDetailsData ,
    isShowChartModelRight: state.DisplayController.isShowChartModelRight, 
    isShowChartModelBottom: state.DisplayController.isShowChartModelBottom
  }),{controller}
)(QuoteDetails);

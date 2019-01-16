/*
* 行情详情组件
* 通过redux 中 isShow 来引用组件和卸载组件
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { controller } from '@/actions'
import './index.less';
import { Resource } from '@/utils/resource';
import { Tabs, Icon } from "antd";
import { formDate, formDate2 } from '@/utils/FormatUtils'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';


class F10NewsListMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choseIndex: 0,
      ZxTxtNwsLstComsArr: '',
      ZxTxtAnnCentersArr: '',
      ZxRrpRptAllsArr: '',

     

      newsDetailsInfo: '',
      currentIndex: props.F10NewsListMoreData.defaultActiveKey,
    }
    this.newsId = '',
    this.ZxTxtAnnCentersPage = 1;
    this.ZxTxtNwsLstComsPage = 1;
    this.ZxTxtNwsLstComsPosid = '',
    this.ZxTxtAnnCentersPosid =  '',
    this.ZxRrpRptAllsPosid = '0';
    this.asset = '';
    this.ZxTxtNwsLstComsFlag = 0;
    this.ZxTxtAnnCentersFlag = 0;
    this.ZxRrpRptAllsFlag = 0;
    this.tabs = [
      {
        tab: "新闻",
        key: "0"
      }, {
        tab: "公告",
        key: "1"
      }, {
        tab: "研报",
        key: "2"
      }
    ]
  }


  serviceNewsDataCallBack(data, type) {
    console.log('列表数据', data)
    data.map(item => {
      item.name = 'DetailNewsLeft'
      item.pub_time = formDate2(item.pub_time)
    });

    if (type === 'ZxTxtNwsLstComs') {
      let _ZxTxtNwsLstComsArr = [...this.state.ZxTxtNwsLstComsArr, ...data]
      this.setState(prev => {
        return {
          ...prev,
          ZxTxtNwsLstComsArr: _ZxTxtNwsLstComsArr,
        }
      })
      this.ZxTxtNwsLstComsFlag = 0;
      this.ZxTxtNwsLstComsPosid = _ZxTxtNwsLstComsArr[_ZxTxtNwsLstComsArr.length-1].posid;
      this.ZxTxtNwsLstComsPage++;
      if (data.length < 10) {
        this.ZxTxtNwsLstComsFlag = 1;
      }
    } else if (type === 'ZxTxtAnnCenters') {
      let _ZxTxtAnnCentersArr = [...this.state.ZxTxtAnnCentersArr, ...data]
      this.setState(prev => {
        return {
          ...prev,
          ZxTxtAnnCentersArr: _ZxTxtAnnCentersArr,
        }
      })
      this.ZxTxtAnnCentersFlag = 0;
      this.ZxTxtAnnCentersPage++;
      this.ZxTxtAnnCentersPosid =  _ZxTxtAnnCentersArr[_ZxTxtAnnCentersArr.length-1].posid;
      if (data.length < 10) {
        this.ZxTxtAnnCentersFlag = 1;
      }
    } else if (type === 'ZxRrpRptAlls') {

      let _ZxRrpRptAllsArrArr = [...this.state.ZxRrpRptAllsArr, ...data]
      this.setState(prev => {
        return {
          ...prev,
          ZxRrpRptAllsArr: _ZxRrpRptAllsArrArr,
        }
      })
      this.ZxRrpRptAllsFlag = 0;
      this.ZxRrpRptAllsPosid = data[data.length - 1].posid;
      if (data.length < 10) {
        this.ZxRrpRptAllsFlag = 1;
      }
    }
    if (this.state.currentIndex === '0') {
      this.newsId = this.state.ZxTxtNwsLstComsArr[0].id;
      this.newsDetail(this.state.ZxTxtNwsLstComsArr[0].id)
    } else if (this.state.currentIndex === '1') {
      this.newsId = this.state.ZxTxtAnnCentersArr[0].id;
      this.newsDetail(this.state.ZxTxtNwsLstComsArr[0].id)
    } else if (this.state.currentIndex === '2') {
      this.newsId = this.state.ZxRrpRptAllsArr[0].id;
      this.newsDetail(this.state.ZxRrpRptAllsArr[0].id)
    }


  }
  tabsChange(index) {
    this.setState(prevState => {
      prevState.currentIndex = index;
      prevState.choseIndex = 0;

      return prevState;
    }, () => {
      if (index === '0') {
        if(this.ZxTxtNwsLstComsPage === 1){
          this.ZxTxtNwsLstComsService();
        }else{
          this.newsId = this.state.ZxTxtNwsLstComsArr[0].id;
          this.newsDetail(this.state.ZxTxtNwsLstComsArr[0].id)
        }
      } else if (index === '1') {
        if(this.ZxTxtAnnCentersPage === 1){
          this.ZxTxtAnnCentersService();
        }else{
          this.newsId = this.state.ZxTxtAnnCentersArr[0].id;
          this.newsDetail(this.state.ZxTxtNwsLstComsArr[0].id)
        }
      }else if (index === '2') {
        if(this.ZxRrpRptAllsPosid === '0'){
          this.ZxRrpRptAllsService();
        }else{
          this.newsId = this.state.ZxRrpRptAllsArr[0].id;
          this.newsDetail(this.state.ZxTxtNwsLstComsArr[0].id)
        }
      }
    })
  }

  handleCancelDetail(data, index) {
    this.setState({ choseIndex: index })
    this.newsId = data.id;
    this.newsDetail()
  }

  newsDetail() {
    if (this.state.currentIndex === '0') {
      Resource.ZxTxtNwsLstComs.post('', '', this.newsId).then((data) => {
        this.setState({ newsDetailsInfo: data })
      }).catch(err => { })
    } else if (this.state.currentIndex === '1') {
      Resource.ZxTxtAnnCenters.post('', '', this.newsId).then((data) => {
        this.setState({ newsDetailsInfo: data })
      }).catch(err => { })
    } else if (this.state.currentIndex === '2') {
      Resource.ZxRrpRptAlls.post('', '', this.newsId).then((data) => {
        this.setState({ newsDetailsInfo: data })
      }).catch(err => { })
    }
  }

  ZxTxtNwsLstComsService() {
    if (this.ZxTxtNwsLstComsFlag === 0) {
      this.ZxTxtNwsLstComsFlag = 1
      Resource.ZxTxtNwsLstComs.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.ZxTxtNwsLstComsPage}/20/0/${this.ZxTxtNwsLstComsPosid}`).then((data) => {
        console.log('新闻', data)
        data = data.datalist;
        this.serviceNewsDataCallBack(data, 'ZxTxtNwsLstComs')
      }).catch(err => { })
    }

  }

  ZxTxtAnnCentersService() {
    if (this.ZxTxtAnnCentersFlag === 0) {
      this.ZxTxtAnnCentersFlag = 1
      Resource.ZxTxtAnnCenters.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.ZxTxtAnnCentersPage}/20/0/${this.ZxTxtAnnCentersPosid}`).then((data) => {
        console.log('公告', data)
        data = data.datalist;
        this.serviceNewsDataCallBack(data, 'ZxTxtAnnCenters')
      }).catch(err => { })
    }
  }

  ZxRrpRptAllsService() {
    if (this.ZxRrpRptAllsFlag === 0) {
      this.ZxRrpRptAllsFlag = 1
      Resource.ZxRrpRptAlls.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.ZxRrpRptAllsPosid}/20`).then((data) => {
        console.log('研报', data)
        data = data.datalist;
        this.serviceNewsDataCallBack(data, 'ZxRrpRptAlls')
      }).catch(err => { })
    }
  }

  componentDidMount() {
    if (this.props.F10NewsListMoreData.defaultActiveKey === '0') {
      this.ZxTxtNwsLstComsService();
    } else if (this.props.F10NewsListMoreData.defaultActiveKey === '1') {
      this.ZxTxtAnnCentersService();
    } else if (this.props.F10NewsListMoreData.defaultActiveKey === '2') {
      this.ZxRrpRptAllsService();
    }

    // this.ZxTxtAnnCentersService();

  }

  handleCancel = () => {
    this.props.controller({ isShowF10NewsListMore: false });
  }

  //文档高度
  getDocumentTop() {
    var scrollTop = document.getElementById('ScrollBox' + this.state.currentIndex).scrollTop;
    return scrollTop;
  }

  //可视窗口高度
  getWindowHeight() {
    var windowHeight = document.getElementById('ScrollBox' + this.state.currentIndex).clientHeight;
    return windowHeight;
  }

  //滚动条滚动高度
  getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.getElementById('ScrollBox' + this.state.currentIndex).scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.getElementById('ScrollBox' + this.state.currentIndex).offsetHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  }

  onScrollHandle(e) {
    if (this.getScrollHeight() < this.getDocumentTop() + this.getWindowHeight() + 50) {
      var _posid;
      if (this.state.currentIndex === '0') {
        this.ZxTxtNwsLstComsService()
      } else if (this.state.currentIndex === '1') {
        this.ZxTxtAnnCentersService()
      } else if (this.state.currentIndex === '2') {
        this.ZxRrpRptAllsService()
      }

    }
  }


  render() {
    return (
      <div className='F10NewsContent'>
        <span onClick={() => this.props.controller({ isShowF10NewsListMore: false })}><Icon type="rollback" theme="outlined" />返回</span>
        <div className='contentLeft'>
          {
            <Tabs defaultActiveKey={this.props.F10NewsListMoreData.defaultActiveKey} onChange={(index) => this.tabsChange(index)}>
              {
                this.tabs.map((item, index) => {
                  return (
                    <Tabs.TabPane tab={item.tab} key={item.key}>
                      <div className="list">
                        {
                          <div id={'ScrollBox' + index} className='scrollDiv' onScroll={e => this.onScrollHandle(e)}>
                            <ul>
                              {
                                item.key === '0' && this.state.ZxTxtNwsLstComsArr && this.state.ZxTxtNwsLstComsArr.map((item, index) => {
                                  return (
                                    <li className={this.state.choseIndex === index ? 'active' : ''} key={index} onClick={e => this.handleCancelDetail(item, index)}>
                                      <h2>{item.tit}</h2>
                                      <span>{item.info_source}</span><span>{item.pub_time}</span>
                                    </li>
                                  )
                                })
                              }
                              {
                                item.key === '1' && this.state.ZxTxtAnnCentersArr && this.state.ZxTxtAnnCentersArr.map((item, index) => {
                                  return (
                                    <li className={this.state.choseIndex === index ? 'active' : ''} key={index} onClick={e => this.handleCancelDetail(item, index)}>
                                      <h2>{item.tit}</h2>
                                      <span>{item.pub_time}</span><span>{item.pub_time}</span>
                                    </li>
                                  )
                                })
                              }
                              {
                                item.key === '2' && this.state.ZxRrpRptAllsArr && this.state.ZxRrpRptAllsArr.map((item, index) => {
                                  return (
                                    <li className={this.state.choseIndex === index ? 'active' : ''} key={index} onClick={e => this.handleCancelDetail(item, index)}>
                                      <h2>{item.tit}</h2>
                                      <span>{item.pub_dt}</span><span>{item.pub_dt}</span>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        }

                      </div>
                    </Tabs.TabPane>
                  )
                })
              }
            </Tabs>
          }
        </div>
        <div className='contentRight'>
          <div className="newsDetails">

            {
              this.state.currentIndex !== '2' &&
              <div className="top">
                <h2>{this.state.newsDetailsInfo.tit}</h2>
                <p className="datetime">
                  来源：<span>{this.state.newsDetailsInfo.info_source}</span> <span>{formDate(this.state.newsDetailsInfo.pub_time, this.state.newsDetailsInfo.pubtime, 'YYYY-MM-DD HH:mm:ss')}</span>
                </p>
                <pre>{this.state.newsDetailsInfo.cont}</pre>
              </div>
            }
            {
              this.state.currentIndex === '2' &&
              <div className="top">
                  <h2>{this.state.newsDetailsInfo.tit}</h2>
                  <p className="datetime">
                    <span>{this.state.newsDetailsInfo.com_name}</span> | <span>{this.state.newsDetailsInfo.aut}</span> | <span>{this.state.newsDetailsInfo.rpt_typ}</span> | <span>{formDate2(this.state.newsDetailsInfo.pub_dt)}</span>
                  </p>
                  <pre>{this.state.newsDetailsInfo.abst}</pre>
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ F10NewsListMoreData: state.DisplayController.F10NewsListMoreData }), { controller }
)(F10WrappedComponent(F10NewsListMore));


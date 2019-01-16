import React from 'react';
import { Timeline } from 'antd';
import {connect} from 'react-redux';
import './NewsOrigin.less';
import { CompBaseClass } from "@/utils/BaseTools.js";
import {monitor,controller} from "@/actions";

import {Resource} from '@/utils/resource';
import {formDate,formDate2} from '@/utils/FormatUtils'
import dq from '@/resources/images/dq.png'
import gg from '@/resources/images/gg.png'
import LoadOrigin from '@/components/lists/LoadOrigin';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';

class NewsOrigin extends CompBaseClass{
  constructor(props){
    super(props);
    console.log(props)
    // debugger
    this.state = {
      livelistArr: [],
      newslistlistArr: [],
      posid : '',
      page : 1,
      flag : '0',
      paramsActionName :'1-23',
    }
    this.domList = this.domList.bind(this);
  }

  componentDidMount() {
    if(this.props.actionName === "livelist"){
      this.emitEvent([{symbol:'1', dataType: '23',length : 10}]);
    }else{
      if(this.props.name === 'DetailNewsLeft'){
        this.serviceNewsData(this.state.page,'DetailNewsLeft',this.state.posid)
      }else if(this.props.name === 'DetailNewsRight'){
        this.serviceNewsData(this.state.page,'DetailNewsRight',this.state.posid)
      }else{
        this.serviceNewsData(this.state.page,'com',this.state.posid)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    let isEqual = _isEqual;
    if(
      nextState.paramsActionName !== this.state.paramsActionName
      || nextProps.actionName !== this.props.actionName
      || (this.isLegal(nextState.livelistArr) && !isEqual(nextState.livelistArr, this.renderDataByNews))
    ){
      this.renderTime ++;
      return true;
    }
    let data = window.superMonitor[nextState.paramsActionName];
    if(data && data.isDataUpdated && !data.isDataUpdated[this.compId]){
      // 组件数据更新引起重绘
      this.renderTime += 1;
      data.preData && (this.preRenderData = data.preData);
      data.isDataUpdated[this.compId] = true;
      return true;
    }
    return false;
  }

  //文档高度
  getDocumentTop() {
    var scrollTop = document.getElementById(this.compId).scrollTop;
    // console.log("scrollTop",scrollTop)
    return scrollTop;
  }

  //可视窗口高度
  getWindowHeight() {
    var windowHeight = document.getElementById(this.compId).clientHeight;
    return windowHeight;
  }

  //滚动条滚动高度
  getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.getElementById('ScrollBox' + this.compId).scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.getElementById(this.compId).offsetHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  }

  serviceNewsDataCallBack(data){
    console.log('列表数据',data)
    data.map(item => {
      item.initData = formDate(item.pubdate, item.pubtime, 'YYYY-MM-DD HH:mm:ss');
      if(this.props.actionName === "newslist"){
        item.fullData = (item.initData).substr(5,5)
        item.pub_time = formDate2(item.pub_time)
      }else{
        item.fullData = (item.initData).substr(11,5)
      }
      item.type = this.props.actionName
    });

    if(this.props.actionName === "livelist"){
      let _livelist = data
      for(var i = 0;i < _livelist.length;i++){
        if(i !== 0 && _livelist[i].pubdate !== _livelist[i-1].pubdate){
          _livelist[i].signdate =  _livelist[i].initData.substr(0,10);
          _livelist[i-1].stylepadding = {
            'padding-bottom' : '50px'
          }
        }
      }
      this.props.monitor({type: this.state.paramsActionName, data: _livelist});
      this.setState({
        livelistArr: _livelist,
        flag: '0',
        posid : data && data.length > 0? data[data.length-1].posid: 0
      })
    }else{
      let _livelist = [...this.state.livelistArr,...data]
      if(this.props.name === 'DetailNewsLeft'){
        this.setState(prev => {
          return {
            ...prev,
            livelistArr: _livelist,
            page: prev.page + 1,
            flag: '0',
            posid : data && data.length > 0? data[data.length-1].posid: 0
          }
        })
      }else if(this.props.name === 'DetailNewsRight'){
        this.setState(prev => {
          return {
            ...prev,
            livelistArr: _livelist,
            page: prev.page + 1,
            flag: '0',
            posid : data && data.length > 0? data[data.length-1].posid: 0
          }
        })
      }else{
        this.setState(prev => {
          return {
            ...prev,
            livelistArr: _livelist,
            flag: '0',
            posid : data && data.length > 0? data[data.length-1].posid: 0
          }
        })
      }
    }
    if(data.length < 10){
      this.setState({flag: '1'})
    }
  }

  serviceNewsData(page,type, posid){
    if(this.state.flag === "0"){
      this.setState({
        flag: 1,
      })
      if(type === 'DetailNewsLeft'){
        Resource.ZxTxtNwsLstComs.post('', '', this.props.actionStock + '/' + page + '/10' + '/' + this.props.asset +'/' +posid).then((data) => {
          data = data.datalist;
          this.serviceNewsDataCallBack(data)
        }).catch(err => {})
      }else  if(type === 'DetailNewsRight'){
        Resource.ZxTxtAnnCenters.post('', '', this.props.actionStock + '/' + page + '/10' + '/' + this.props.asset+'/' +posid).then((data) => {
          data = data.datalist;
          this.serviceNewsDataCallBack(data)
        }).catch(err => {})
      }else{
        Resource[this.props.actionName].post('', '', posid).then((data) => {
          this.serviceNewsDataCallBack(data)
        }).catch(err => {})
      }
    }
  }

  onScrollHandle(e){
    if(this.getScrollHeight() < this.getDocumentTop() + this.getWindowHeight() + 50){
      var _posid;
      if(this.props.actionName === "livelist"){
        if(this.props.data[this.state.paramsActionName].length <= 10){
          _posid = this.props.data[this.state.paramsActionName][this.props.data[this.state.paramsActionName].length - 1].posid
        }else{
          _posid = this.state.posid;
        }
      }else{
        _posid = this.state.posid;
      }
      if(this.props.name === 'DetailNewsLeft'){
        this.serviceNewsData(this.state.page,'DetailNewsLeft', _posid)
      }else if(this.props.name === 'DetailNewsRight'){
        this.serviceNewsData(this.state.page,'DetailNewsRight',_posid)
      }else{
        this.serviceNewsData('','com', _posid)
      }
    }
  }

  domList(livelistArr){
    return this.props.actionName === "livelist"?(
      <div className="newsBox livelist">
        <div id={'ScrollBox' + this.compId} className="scrollBox">
          <Timeline>
            {
              livelistArr.map((item, index) => {
                let newRows = {};
                if(this.props.newsProps && this.props.newsProps.onRow) {
                  let handlersObj = this.props.newsProps.onRow;
                  let handlers = Object.keys(handlersObj);
                  handlers.forEach(name => {
                    newRows[name] = () => {
                      handlersObj[name](item, index);
                    }
                  })
                }
                return (
                  <Timeline.Item key={index} style={item.stylepadding}>
                    {
                      item.signdate && <span className="signDate">{item.signdate}</span>
                    }
                    <div key={index} className="liveItem">
                      {
                        this.props.newsProps.columns[this.props.actionName].map((value, ii) => {
                          return (
                            <span
                              key={value}
                              {...(ii === 1 && newRows)}
                              className={ii === 0? 'time': 'title'}>
                              {item[value]}
                            </span>
                          )
                        })
                      }
                    </div>
                  </Timeline.Item>
                )
              })
            }
          </Timeline>
        </div>
      </div>
    ): (
      <div className="newsBox">
        <div  id={'ScrollBox' + this.compId}>
          {
            this.state.livelistArr.length > 0 && this.state.livelistArr.map((item, index) => {
              let newRows = {};
              item.name = this.props.name
              if(this.props.newsProps && this.props.newsProps.onRow) {
                let handlersObj = this.props.newsProps.onRow;
                let handlers = Object.keys(handlersObj);
                handlers.forEach(name => {
                  newRows[name] = () => {
                    handlersObj[name](item, index);
                  }
                })
              }
              return (
                <div  key={index}>
                  <div key={index} className="newsList" {...newRows}  onClick={e => this.props.controller({isShowNewsDetails:true, newsDetailsData:item})}>
                    {
                      this.props.newsProps.columns[this.props.actionName].map((value, ii) => {
                        return (
                          <span
                            key={value}
                            {...(ii === 1 && newRows)}
                            className={ii === 0? 'time': 'title'}>
                            {item[value]}
                          </span>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }) || <LoadOrigin type={'nomore'}/>
          }
        </div>
      </div>
    )
  }

  render(){
    console.log('news组件渲染次数', this.compId, this.renderTime);
    let renderData;
    this.renderDataByLive = _cloneDeep(this.props.data[this.state.paramsActionName]);
    this.renderDataByNews = _cloneDeep(this.state.livelistArr);
    if(this.props.actionName === "livelist"){
      renderData = _cloneDeep(this.renderDataByLive);
    }else if(this.props.actionName === "newslist"){
      renderData = _cloneDeep(this.renderDataByNews);
    }
    renderData && renderData.map(item => {
      item.initData = formDate(item.pubdate, item.pubtime, 'YYYY-MM-DD HH:mm:ss');
      if(this.props.actionName === "newslist"){
        item.fullData = (item.initData).substr(5,5)
      }else{
        item.fullData = (item.initData).substr(11,5)
      }
      item.type = this.props.actionName
    });
    return (
      <div style={{height:'100%'}}>
        {
          this.props.newsProps && this.props.newsProps.title &&
          <h2 className="h2title"><img src={this.props.name === 'DetailNewsLeft' && dq || gg} className="newsLabel" />{this.props.newsProps.title}</h2>
        }
        {
          !this.isLegal(renderData) && (
            <LoadOrigin />
          ) || (
            <div
              id={this.compId}
              data-actionname={this.props.actionName}
              style={{height: this.props.boxHeight + 'px'}}
              onScroll={e => this.onScrollHandle(e)}
              className="newsOrigin">
              {renderData && this.domList(renderData)}
            </div>
          )
        }
      </div>

    )
  }
}
export default connect(
  state => ({data: state.Data}), {monitor,controller}
)(NewsOrigin);

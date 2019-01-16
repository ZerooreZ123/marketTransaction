import React, { Component } from 'react';
import _round from 'lodash/round';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _maxBy from 'lodash/maxBy';
import _minBy from 'lodash/minBy';

import {formDate, filterData, formTime, numTransform, filterRN} from './FormatUtils'
import config from '@/config';
import moment from 'moment';
import { add } from '@/actions';
const proto = require("./proto.json");
const protobuf = require("protobufjs");
const protoRoot = protobuf.Root.fromJSON(proto);
const uuid = require('uuid/v1');

/* *****************
 * 与后端约定格式, 前期前端维护, 后面会让后端返回
 * ****************/
const dataTypeMaps = [{
  // 开收盘信号
  dataType: 0,
  fileName: 'MarketInfo',
  className: 'MarketInfo'
}, {
  dataType: 4,
  fileName: 'Tick',
  className: 'Tick'
}, {
  dataType: 5,
  fileName: 'SnapShot',
  className: 'SnapShot'
}, {
  // 涨跌排行榜
  dataType: 18,
  fileName: 'ComprehensiveRank',
  className: 'ComprehensiveRank'
}, {
  // 分时
  dataType: 7,
  fileName: 'TimeLine',
  className: 'TimeLine'
}, {
  // 表格
  dataType: 19,
  fileName: 'SnapBody',
  className: 'SnapBody'
}, {
  dataType: 17,
  fileName: 'IndexStat',
  className: 'IndexStat'
}, {
  // 单个订阅
  dataType: 6,
  fileName: 'SnapBody',
  className: 'SnapBody'
}, {
  dataType: 23,
  fileName: 'LiveNews',
  className: 'LiveNews'
}, {
  dataType: 14,
  fileName: 'PriceFence',
  className: 'PriceFence'
}, {
  // 码表
  dataType: 99,
  fileName: 'CodeList',
  className: 'CodeList'
}, {
  // 1分k
  dataType: 8,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 5分k
  dataType: 9,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 15分k
  dataType: 10,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 30分k
  dataType: 11,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 60分k
  dataType: 12,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 日k
  dataType: 13,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 周k
  dataType: 20,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 月k
  dataType: 21,
  fileName: 'KLine',
  className: 'KLine'
}, {
  // 年k
  dataType: 22,
  fileName: 'KLine',
  className: 'KLine'
}, {
  dataType: 15,
  fileName: 'FundFlow',
  className: 'FundFlow'
}, {
  dataType: 16,
  fileName: 'FundFlow',
  className: 'FundFlow'
}]

class ProtoError extends Error {
  constructor({dataType, data, arrayFlag, message, stack}){
    super(message, stack);
    this.dataType = dataType;
    this.data = data;
    this.message = message;
    this.arrayFlag = arrayFlag;
    this.stack = stack;
  }
}

class ProtoManager {
  /* ***************
   * 说明: 用于加载并解码数据
   * eg:
   *   protoManager.decodeData(data, dataType)
   *     .then(data => {});
   * **************/
  constructor() {
    this.basePath = config.PROTO_PATH;
    this.baseSign = "com.xinyu.unidata.protocbuf";
    this.protos = {};
    // 加载proto文件错误后默认重启时间
    this.defaultDelayTime = 3;
    // 默认加载错误次数, 达到该阈值后报错
    this.defaultRetryTimes = 5;
    // 转换映射关系
    this.dataTypeMapsToProtoMaps();
  }

  delay = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

  dataTypeMapsToProtoMaps(){
    /* *******************
     * 生成Map容器, 用于存储dataType与fileName,className的关系
     * eg: this.protoMaps.get(7) // return => {dataType: 4, fileName: 'Tick', className: 'Tick'}
     * ******************/
    if(this.protoMaps) return;
    this.protoMaps = new Map();
    dataTypeMaps.forEach(item => this.protoMaps.set(item.dataType, item));
  }

  decodeData(data, dataType, arrayFlag, symbol){
    /* ****************
     * params:
     *   data: 待解码数据
     *   dataType: 类型标志, 用于拿取解码用的protoName和className
     * return:  Promise对象
     * ****************/
    let names = this.protoMaps.get(dataType);
    let root = protoRoot.lookupType(`${this.baseSign}.${names.className}`);
    let newData;
    if(arrayFlag){
      try{
        newData = Array.from(data, (item, index) => root.decode(new Uint8Array(item)));
      }catch(err){
        throw new ProtoError({data, dataType, arrayFlag, message: '解析数组数据错误', stack: err});
      }
    }else{
      try{
        newData = root.decode(new Uint8Array(data));
      }catch(err){
        throw new ProtoError({data, dataType, arrayFlag, message: '解析对象数据错误', stack: err});
      }
    }
    try{
      newData = this.parseData(newData, dataType, symbol);
    }catch(err){
      throw new ProtoError({data: newData, dataType, arrayFlag, message: '解析数据成功但格式化数据失败', stack: err});
    }
    //if(newData.length === 0){
    //  throw new ProtoError({data: newData, dataType, arrayFlag, message: '空数组'});
    //}else{
    return newData;
    //}
  }

  parseData(data, dataType, symbol){
    /* ********************
     * 数据返回后对原始数据进行处理, 返回处理过的数据
     * *******************/
    switch(dataType){
      case 18:
        ['netChangeRatioDownRank', 'netChangeRatioUpperRank', 'speedRatioDownRank', 'speedRatioUpperRank'].forEach(name => {
          data[name] = data[name].map(item => {
            Object.entries(item.stockBasic).forEach(([key, value]) => item[key] = value);
            filterRN(item,item.stockBasic.uuid)
            filterData({item, symbol: item.stockBasic.uuid});
            return {...item}
          });
        })
        break;
      case 7:
        if(!(data instanceof Array)) data = [data];
        data.map((item, index, array) => {
          if(symbol.split('.')[0] === 'INDEX')item.avgPrice = item.price;
          item.bprice = index === 0? item.preClose: array[index-1].price;
          item.date = formDate(item.date, item.time);
          filterData({item, symbol})
        });
        break;
      case 6:
        // 单个数据
        // debugger
        Object.entries(data.stockBasic).forEach(([key, value]) => data[key] = value);
        data.netChangeNum = `${data.RiseVolume || '-'}/${data.FallVolume || '-'}`;
        data = {...filterData({item: data, symbol, isTP: 1,isStr: 1})};
        break;
      case 17:
        data = filterData({item: data, symbol, isStr: 1});
        break;
      case 4:
        if(!(data instanceof Array)) data = [data];
        data.map((item, index, array) => {
          item.date = (formDate(item.date, item.time, 'YYYY-MM-DD HH:mm:ss')).substr(11,5)
          item = filterData({item, symbol, isStr: 1});
        });
        break;
      case 14:
        data.fence.map((item,index) => {
          item.askVolume = item.askVolume ?item.askVolume :0;
          item.bidVolume =item.bidVolume ?item.bidVolume :0;
          item.initNum =  item.askVolume + item.bidVolume;
        })
        data.maxNum = _maxBy(data.fence, 'initNum').volume;
        data.minNum =_minBy(data.fence, 'initNum').volume;
        data.fence.map((item,index) => {
          item = filterData({item, symbol, isStr: 1});
          item.volumeWidth = 100 * item.initNum/data.maxNum;
          item.askWidth = 100 * item.askVolume/item.initNum;
          item.bidWidth= 100 * item.bidVolume/item.initNum;
        })
        break;
      case 5:
        // 盘口数据
        Object.entries(data.stockBasic).forEach(([key, value]) => data[key] = value);
        data = filterData({item: data, symbol, isStr: 1});
        data.time = formTime(data.time)
        data.ask.map((item,index) => {
          item.asktext = numTransform(index,'卖');
          item = filterData({item, symbol, isStr: 1})
        })
        data.ask.reverse();
        data.bid.map((item,index) => {
          item.asktext = numTransform(index,'买');
          item = filterData({item, symbol, isStr: 1})
        })
        break;
      case 19:
        // 表格数据
        data = data.map(item => {
          Object.entries(item.stockBasic).forEach(([key, value]) => item[key] = value);
          item.netChangeNum = `${item.RiseVolume || '-'}/${item.FallVolume || '-'}`;
          filterData({item, symbol: item.uuid});
          return {...item};
        });
        break;
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 20:
      case 21:
      case 22:
        if(!(data instanceof Array)){
          data = [this.parseKlineData(data, dataType)];
        } else{
          data.map((item, index) => {
            this.parseKlineData(item, dataType);
          });
        }
        break
      case 23:
        // 表格数据
        data.reverse();
        break;
    }
    return data;
  }

  parseKlineData(item, dataType){
    // 详情页K线数据处理
    ['open', 'close', 'high', 'low', 'preClose'].forEach(key => item[key] && (item[key] /= 10000));
    let zero = '';
    if(item.time < 10000000){
      zero = '00';
    }else if(item.time < 100000000){
      zero = '0';
    }
    let dated = moment(`${item.date}${zero}${item.time}`, "YYYYMMDDHHmmss");
    if([7, 13, 20, 21, 22].indexOf(dataType) > -1){
      item.dated = parseInt(dated.format('YYYYMMDD'));
      item.pdate = dated.format('YYYYMM');
    }else{
      item.dated = parseInt(dated.format('YYYYMMDDHHmmss'));
      item.pdate = dated.format('MMDDHHmm');
    }
    item.date = dated.toDate();
    return item;
  }

  static handleData(type, prevData, nowData){
    // 异常数据请一定返回false
    let indexAt, dataType = parseInt(type.split('-')[1]);
    if(nowData.length === 0){
      if(prevData && ('data' in prevData))return [prevData.data];
      if(prevData)return [prevData];
      return [[]]
    }
    switch(dataType){
      case 7:
        // 处理分时图表数据
        if(nowData.length === 242){
          // 当数据数量为242时说明为上次交易日数据, 则直接替换
          return [nowData, 241];
        };
        let dateRange = [[9, 30], [11, 30], [13, 0], [15, 0]].map(item => moment([...moment().toArray().slice(0, 3), ...item]).unix());
        nowData.forEach(item => {
          let unixTime = item.date.getTime() / 1000, index = -1;
          (unixTime >= dateRange[0] && unixTime <= dateRange[1]) && (index = 0);
          (unixTime >= dateRange[2] && unixTime <= dateRange[3]) && (index = 2);
          index !== -1 && (indexAt = (unixTime - dateRange[index]) / 60 + 121 * (index / 2), prevData[indexAt] = item);
        })
        return [prevData, indexAt];
      case 4:
        (prevData && nowData.length === 1) && (prevData.push(nowData[0])) || (prevData = nowData)
        return [prevData];
      case 23:
        (prevData && nowData.length > 1) && (prevData.push(...nowData)) || (prevData = nowData)
        return [prevData];
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 20:
      case 21:
      case 22:
        let order;
        if(prevData && prevData.order)order = prevData.order;
        if(nowData && nowData.order)order = nowData.order;
        if(!prevData){
          prevData = nowData;
        }else if(nowData.length === 1){
          if(nowData[0].dated === prevData[prevData.length - 1].dated){
            // 最新数据更新
            prevData[prevData.length - 1] = nowData[0];
          }else if(nowData[0].dated > prevData[prevData.length - 1].dated) {
            // 新数据放于最后面
            prevData = [...prevData, ...nowData];
          }else if(nowData[0].dated < prevData[0].dated){
            // 请求历史数据当只剩一条的处理
            prevData = [...nowData, ...prevData];
          }
        }else if(nowData[nowData.length - 1].dated < prevData[0].dated){
          // 当新数据最后一条时间早于数据集第一条数据的时间, 则说明是历史数据, 则合并
          prevData = [...nowData, ...prevData];
        }else if(nowData[nowData.length - 1].dated > prevData[prevData.length - 1].dated){
          // 当新数据最后一条时间晚于数据集最后一条数据的时间, 则说明是新数据直接替换
          prevData = nowData;
        }
        if(order)prevData.order = order;
        return [prevData];
    }
    return [nowData];
  }
}

class CompBaseClass extends Component{
  /* ***************
   * 说明: 组件继承此类, socket操作统一管理
   * **************/
  constructor(){
    super(...arguments);
    this.compId = 'comp-' + uuid();
    this.handleTime = null;
    // 开发时控制订阅请求的类别, 当为true表示全部订阅, 或为数组包含订阅类型
    //this.allowEmits = [7];
    this.allowEmits = true;
    //this.allowEmits = false;
    this.pageClick = this.pageClick.bind(this);
    this.renderTime = 0;
    this.shouldComponentUpdateHandle = this.shouldComponentUpdateHandle.bind(this);
    // 是否数据更新引起的视图渲染
    this.isRenderByData = true;
    this.rendered = true;
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.shouldComponentUpdateHandle(nextProps, nextState);
  }

  shouldComponentUpdateHandle(nextProps, nextState, actionName){
    if(!actionName){
      actionName = nextProps.actionName;
    }
    let data = window.superMonitor[actionName];
    if(data && data.isDataUpdated && !data.isDataUpdated[this.compId]){
      // 组件数据更新引起重绘
      this.renderTime += 1;
      data.preData && (this.preRenderData = data.preData);
      data.isDataUpdated[this.compId] = true;
      this.isRenderByData = true;
      return true;
    }
    let isEqual = _isEqual;
    if(nextProps.width !== this.props.width
      || this.rendered === false
      || actionName !== this.props.actionName
      || nextProps.activeIndex !== this.props.activeIndex
      || nextProps.compType !== this.props.compType
      || nextProps.tableProps !== this.props.tableProps
      || this.renderTime === 0
      || !isEqual(nextState, this.state)
      || nextProps.height !== this.props.height
      || (this.canRenderPropsItems && this.canRenderPropsItems.some(key => !_isEqual(this.backup[key], nextProps[key])))
    ){
      // 组件关键配置引起重绘
      this.renderTime += 1;
      return true;
    }
    return false;
  }

  isLegal(data){
    /* **************
     * 判断数据是否为合法数据
     * *************/
    if(data === undefined || data === 'undefined' || data === null || data === 'null'){
      return false
    }
    if(data.constructor === Array && data.length === 0){
      return false
    }
    if(data.constructor === Object && Object.keys(data).length === 0){
      return false;
    }
    return true;
  }

  delSelfOption(data, isOtherTab=0){
    // 删除自选
    if(!this.isLegal(data))return;
    let index = window.selfOptions.findIndex(item => item.uuid === data.uuid);
    window.selfOptions.splice(index, 1);
    this.unemitEvent(`${data.uuid}-6`);
    this.props.del({data, type: 'option-ALL'});
    // 详情页自选处理
    !isOtherTab && localStorage.setItem('option-remove', JSON.stringify({...data, app_uuid: window.superMonitor.app_uuid, invalid_uuid: uuid()}));
    if(isOtherTab){
      // 详情页自选处理
      this.props.displayController.isShowQuoteDetails
        && this.props.displayController.quoteDetailsData.uuid === data.uuid
        && this.props.update({type: 'quoteDetailsData', updateArr: [{isOption: false}]});
      this.$('.klineChart .handlerList .anticon-minus').forEach(ele => {
        ele.classList.remove('anticon-minus');
        ele.classList.add('anticon-plus');
      })
      // 自选面板操作
      this.$('.menuList').forEach(ele => ele.style.display = 'none');
    }
    // 删除自选标志类
    data.uuid && this.$(`.table-common .TbodyWrap .${data.uuid.replace('.', '')} .stockName`).forEach(ele => {
      if(ele.classList.contains('is-my-stock')){
        ele.classList.remove('is-my-stock');
      }
    })
    return true;
  }

  addSelfOption(data, isOtherTab=0){
    // 添加自选
    data && !data.upDataTime && (data.upDataTime = parseInt(moment().format('YYYYMMDD')));
    data && (data.upDataTime = parseInt(moment().format('YYYYMMDD')));
    data && window.selfOptions.push(_cloneDeep(data));
    window.selfOptions.length > 0 && window.selfOptions.forEach(item => this.emitEvent([{symbol: item.uuid, dataType: 6}], true));
    data && window.store.dispatch({type: String(add), payload: {type: 'option-ALL', data}});
    // 数据存入option-current用于多tab间联动
    data && !isOtherTab && localStorage.setItem('option-add', JSON.stringify({...data, app_uuid: window.superMonitor.app_uuid, invalid_uuid: uuid()}));
    if(isOtherTab){
      // 详情页自选处理
      this.props.displayController.isShowQuoteDetails
        && this.props.displayController.quoteDetailsData.uuid === data.uuid
        && this.props.update({type: 'quoteDetailsData', updateArr: [{isOption: true}]});
      this.$('.klineChart .handlerList .anticon-plus').forEach(ele => {
        ele.classList.remove('anticon-plus');
        ele.classList.add('anticon-minus');
      })
      // 自选面板操作
      this.$('.menuList').forEach(ele => ele.style.display = 'none');
    }
    // 增加自选标志
    data && data.uuid && this.$(`.table-common .TbodyWrap .${data.uuid.replace('.', '')} .stockName`).forEach(ele => {
      if(!ele.classList.contains('is-my-stock')){
        ele.classList.add('is-my-stock');
      }
    })
    return true;
  }

  emitEvent(emitData, isMust, bz){
    // 发起订阅事件}
    if(!emitData || (!isMust && this.props.actionName && this.props.actionName.split('-')[0] === 'option'))return;
    if(!emitData.every(item => this.isLegal(item.symbol) && this.isLegal(item.dataType))){
      console.log('weberror: 传入的symbol或者dataType异常, ', emitData, ', props值为: ', this.props, ', state: ', this.state);
      return;
    }
    // 第一次无延时
    //if(!window.superMonitor[`${item.symbol}-${item.dataType}`])isMust = true;
    if(emitData && (this.allowEmits === true || (this.allowEmits.constructor === Array && this.allowEmits.indexOf(parseInt(emitData[0].dataType)) > -1))){
      this.handleTime = Date.now();
      let handleTime = this.handleTime, self = this;
      setTimeout(() => {
        if(handleTime === self.handleTime || isMust){
          // console.log('=========================订阅操作, emitData: ', emitData, self.compId);
          emitData.forEach(item => {
            let actionName = `${item.symbol}-${item.dataType}`;
            if(!window.superMonitor[actionName] || !window.superMonitor[actionName].compIds){
              window.superMonitor[actionName] = {
                actionName: actionName,
                // 发起订阅次数
                emitNum: 0,
                // 发起订阅时间
                emitTime: [],
                lastEmitTime: null,
                // 接收数据次数
                meetNum: 0,
                // 接收数据时间
                meetTime: [],
                lastMeetTime: null,
                // 保存数据次数
                saveNum: 0,
                // 最后一次保存数据时间
                lastSaveTime: null,
                // 取消订阅次数
                unemitNum: 0,
                // 最后一次取消订阅时间
                lastUnemitTime: null,
                reEmitTime: [],
                // 用于保存组件id, 当size为0时表示没有组件使用此数据
                compIds: new Set(),
                // 渲染视图的数据, 同时也是相对于数据更新前的上一次数据
                preData: null,
                // 是否数据更新, 数据更新时设为{}, 当渲染过一次视图后对应compId key的值设为true
                isDataUpdated: null,
                ...(window.superMonitor[actionName] || {})
              }; // emitTime为发送时间, meetTime为接收时间
              if(item.dataType === 7 || item.dataType === '7'){
                // 用于定位数据下标, 用于计算分时数据是否完整
                window.superMonitor[actionName].indexAt = 0;
              }
            }
            //window.superMonitor[actionName].emitTime.push(moment().format('YYYY-MM-DD HH:mm:ss'));
            window.superMonitor[actionName].lastEmitTime = moment().format('YYYY-MM-DD HH:mm:ss');
            window.superMonitor[actionName].emitNum ++;
            window.superMonitor[actionName].command = [item];
            window.superMonitor[actionName].isSubscription = true;
            window.superMonitor[actionName].compIds.add(self.compId);
          })
          // console.log('测试示例: ', JSON.stringify({subs: emitData}));
          window.socket.emit('sub', {subs: emitData});
        }
      }, isMust? 0: 100);
    }
  }

  updateColor(preData, nowData){
    if(preData === nowData)return '';
    return preData > nowData? 'aniupper': 'aniunder'
  }

  unemitEventHandle(item, [symbol, dataType]){
    if(!this.isLegal(item) || !this.isLegal(symbol) || !this.isLegal(dataType) || !item.compIds){
      console.log('取消订阅数据或symbol或dataType不合法, compId', this.compId, symbol, dataType, item);
      return;
    }
    item.compIds.delete(this.compId);
    if(item.isSubscription && item.compIds.size === 0){
      item.lastUnemitTime = moment().format('YYYY-MM-DD HH:mm:ss');
      item.unemitNum ++;
      item.isSubscription = false;
      console.log('=========================取消单个订阅操作, emitData: ', item.actionName, this.compId);
      window.socket.emit('unsub', {symbol, dataType});
    }
  }

  unemitEvent(actionName, isMust){
    // 发送取消订阅请求
    if(actionName){
      // 组件内执行取消订阅操作
      this.unemitEventHandle(window.superMonitor[actionName], actionName.split('-'));
    }else{
      // 组件卸载取消订阅所有
      Object.entries(window.superMonitor).map(([key, item]) => {
        if(item.constructor === Object && item.compIds){
          this.unemitEventHandle(item, key.split('-'));
        }
      })
    }
  }

  pageClick(e){
    this.$('.menuList').forEach(ele => ele.style.display = 'none');
    document.removeEventListener("click", this.pageClick);
  }

  showAddOptionPanel(e, data, index, isSelfOption){
    e.preventDefault();
    window.currentSelfOption = {...data, compId: this.compId, addOptionIndex: index, actionName: this.props.actionName};
    document.addEventListener("click", this.pageClick);
    let ele = this.$('.menuList')[0];
    let tarEle = this.$(`#${this.compId} .TbodyInner .stockName`)[index];
    ele.classList.remove('menuList_add', 'menuList_del', 'menuList_none');
    if(data.isNotDel === true){
      ele.classList.add('menuList_none');
    }else{
      ele.classList.add(tarEle.classList.contains('is-my-stock') || this.props.actionName.split('-')[0] === 'option'? 'menuList_del': 'menuList_add');
    }
    ele.style.display = "block";
    const {innerHeight: globalHeight, innerWidth: globalWidth} = window;
    const {clientWidth: panelWidth, clientHeight: panelHeight} = ele;
    const {pageX, pageY} = e;
    let showLeft = pageX + 5, showTop = pageY + 5;
    if(panelWidth + pageX + 10 > globalWidth){
      showLeft = pageX - panelWidth - 5;
    }
    if(panelHeight + pageY + 10 > globalHeight){
      showTop = pageY - panelHeight - 5;
    }
    ele.style.left = `${showLeft}px`;
    ele.style.top = `${showTop}px`;
  }

  $ = (selector) => {
    if (!selector) { return []; }
    var arrEle = [];
    if (document.querySelectorAll) {
      arrEle = document.querySelectorAll(selector);
    } else {
      var oAll = document.getElementsByTagName("div"), lAll = oAll.length;
      if (lAll) {
        var i = 0;
        for (i; i<lAll; i+=1) {
          if (/^\./.test(selector)) {
            if (oAll[i].className === selector.replace(".", "")) {
              arrEle.push(oAll[i]);
            }
          } else if(/^#/.test(selector)) {
            if (oAll[i].id === selector.replace("#", "")) {
              arrEle.push(oAll[i]);
            }
          }
        }
      }
    }
    return arrEle;
  };
}

class MouseEventTool extends CompBaseClass{
  /* ***************
   * 说明: 组件继承此类, 获得鼠标操作能力, 同时此类继承CompBaseClass
   * **************/
  constructor(){
    super(...arguments);
    this.startHandle = this.startHandle.bind(this);
    this.handling = this.handling.bind(this);
    this.endHandle = this.endHandle.bind(this);
    this.mouseStartInfo = {}
  }

  startHandle(e){
    /* **************************
     * mouseStartInfo为鼠标事件初始值
     *   startX: 初始X轴坐标
     *   startY: 初始Y轴坐标
     *   tarEle: 目标Dom元素
     *   operType: 操作类型['move', 'resize-${dirc}']
     *   conifg: [{
     *     main: css熟悉名,
     *     maxData: 最大值,
     *     minData: 最小值
     *   }]
     * *************************/
    e.stopPropagation();
    //if(!this.props.data[this.props.actionName])return;
    this.mouseStartInfo = {
      ...(this.mouseStartInfo || {}),
      startX: e.clientX,
      startY: e.clientY,
      tarEle: [e.target],
      ...(this.getAttribute && this.getAttribute(e) || {operType: 'move', config: []})
    }
    if(this.mouseStartInfo.moveFlag && !e.target.classList.contains('moveFlag'))return;
    const { width, height, left, top } = window.getComputedStyle(this.mouseStartInfo.tarEle[0]);
    this.mouseStartInfo.width  = parseFloat(width),
    this.mouseStartInfo.height = parseFloat(height),
    this.mouseStartInfo.left   = parseFloat(left),
    this.mouseStartInfo.top    = parseFloat(top),
    this.mouseStartInfo.startCallBack && this.mouseStartInfo.startCallBack(this.mouseStartInfo);
    document.addEventListener("mousemove", this.handling);
    document.addEventListener("mouseup", this.endHandle);
  }

  handling(e){
    e.stopPropagation();
    let operInfo = this.mouseStartInfo
      , disX = operInfo.startX - e.clientX
      , disY = operInfo.startY - e.clientY
      , left, top, width, height, data
      , self = this;
    switch(operInfo.operType){
      case "move":
        left = disX, top = disY, width = 0, height = 0;
        break;
      case "resize-tl":
        left = disX, top = disY, width = -1 * disX, height = -1 * disY;
        break;
      case "resize-top":
        left = 0, top = disY, width = 0, height = -1 * disY;
        break;
      case "resize-tr":
        left = 0, top = disY, width = disX, height = -1 * disY;
        break;
      case "resize-right":
        left = 0, top = 0, width = disX, height = 0;
        break;
      case "resize-br":
        left = 0, top = 0, width = disX, height = disY;
        break;
      case "resize-bottom":
        left = 0, top = 0, width = 0, height = disY;
        break;
      case "resize-bl":
        left = disX, top = 0, width = -1 * disX, height = disY;
        break;
      case "resize-left":
        left = disX, top = 0, width = -1 * disX, height = 0;
        break;
    }
    data = {
      left:   operInfo.left - left,
      top:    operInfo.top - top,
      width:  operInfo.width - width,
      height: operInfo.height - height,
    }
    operInfo.goingCallBack
      && operInfo.goingCallBack(data, this.mouseStartInfo)
      || operInfo.config.forEach(item => {
        this.mouseStartInfo.goingFlag = true;
        let tmp = data[item.main], tmpData = {};
        ['minData', 'maxData'].forEach(key => tmpData[key] = item[key].constructor === Function? item[key](data, operInfo.config): item[key]);
        if(tmpData.minData !== -1 && tmpData.maxData !== -1){
          tmp < tmpData.minData && (tmp = tmpData.minData);
          tmp > tmpData.maxData && (tmp = tmpData.maxData);
          self.mouseStartInfo[`new_${item.main}`] = tmp;
          self.mouseStartInfo[`${operInfo.type}_${item.main}`] = tmp;
          operInfo.tarEle.forEach(ele => {
            ele.style[item.main] = tmp + 'px';
            if(['width', 'height'].indexOf(item.main) > -1){
              ele.style[`min-${item.main}`] = tmp + 'px';
              ele.style[`max-${item.main}`] = tmp + 'px';
            }
          });
        }
      })
  }

  endHandle(e){
    e.stopPropagation();
    this.mouseStartInfo.endCallBack && this.mouseStartInfo.endCallBack(this.mouseStartInfo);
    //this.mouseStartInfo = {};
    document.removeEventListener("mousemove", this.handling);
    document.removeEventListener("mouseup", this.endHandle);
  }

  addEvent(eName, eFunc, eSelector){
    for (var e = this.$(eSelector), t = 0, n = e.length; t < n; t++) e[t].addEventListener(eName, this[eFunc]);
  }

  removeEvent(eName, eFunc, eSelector){
    for (var e = this.$(eSelector), t = 0, n = e.length; t < n; t++) e[t].removeEventListener(eName, this[eFunc]);
  }
}

export { ProtoManager, CompBaseClass, MouseEventTool };

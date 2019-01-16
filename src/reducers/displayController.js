import { handleActions } from 'redux-actions';
import { controller, update, updateconfig } from '../actions/displayController';
import { cycleBarConfig, indexConfig, } from '@/components/lists/klineConfig.js';
import _cloneDeep from 'lodash/cloneDeep';

const DisplayController = handleActions({
  [controller]: (state, {payload}) => {
    if(payload.constructor === String)payload = {[payload]: !state[payload]};
    return {
      ...state,
      ...payload,
    }
  },

  [update]: (state, {payload}) => {
    /* *****************
     * type: key
     * updateArr: []
     * ****************/
    let {type, updateArr} = payload;
    updateArr.forEach(item => {
      state[type] = {...state[type], ...item};
    })
    return state;
  },

  [updateconfig]: (state, {payload}) => {
    let {type} = payload;
    if(type === 'index'){
      state.indexConfig = {...getIndexConfig(), index: state.indexConfig.index + 1};
    }else if(type === 'bar'){
      state.barConfig = getBarConfig();
    }
    return state;
  },
}, {
  isShowQuoteDetails: false,
  quoteDetailsData: {
    "exchange": "SZ",
    "stockCode": "000002",
    "uuid": "SZ.000002",
    "stockName": "万科 A",
    "stockStatus": 2,
    "ccyCode": "CNY",
    "unit": 100,
    "priceStep": 2,
    "codeNumber": 751516,
    "securityType": 14,
    "asset": 6,
    "subnew": 0,
    "tradflag": 0,
    "digit": 2,
  },
  isShowNewsDetails: false,
  newsDetailsData: {},
  isShowMenu: false,
  menuData: {},
  isShowKeyBoard: false,
  showKeyBoardData: {},
  isShowF10: false,
  f10Data: {},
  // f10Data: {
  //   "exchange": "SZ",
  //   "stockCode": "000002",
  //   "uuid": "SZ.000002",
  //   "stockName": "万科 A",
  //   "stockStatus": 2,
  //   "ccyCode": "CNY",
  //   "unit": 100,
  //   "priceStep": 2,
  //   "codeNumber": 751516,
  //   "securityType": 14,
  //   "asset": 6,
  //   "subnew": 0,
  //   "tradflag": 0,
  //   "digit": 2,
  // },
  isShowPensDetail: false,
  isShowF10NewsListMore : false,
  F10NewsListMoreData :{},
  isShowChartModelRight : true,
  isShowChartModelBottom : true,
  indexConfig: {...getIndexConfig(), index: 0},
  barConfig: getBarConfig(),
  drawLineData: {
    enabledName: ''
  }
});

function getIndexConfig(){
  // 从缓存中读取指标配置信息
  let storageConfig = JSON.parse(localStorage.getItem('kline:config')) || {};
  let indexConfigCopy = _cloneDeep(indexConfig);
  Object.keys(indexConfigCopy).forEach(key => {
    if(storageConfig[key]){
      indexConfigCopy[key].options = {...indexConfigCopy[key].options, ...storageConfig[key].options};
      indexConfigCopy[key].tipConfig.configs = indexConfigCopy[key].tipConfig.configs.map((item, index) => ({...item, ...storageConfig[key].configs[index]}))
    }
  })
  return indexConfigCopy;
}

function getBarConfig(){
  // 从缓存中读取导航条配置信息
  let barConfig = JSON.parse(localStorage.getItem('kline:bar-config')) || {};
  let cycleBarConfigCopy = _cloneDeep(cycleBarConfig);
  return cycleBarConfigCopy.map(item => ({...item, ...(barConfig[item.name] || {})}));
}

export default DisplayController;


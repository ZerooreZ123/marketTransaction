import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers';
import promiseMiddleware from 'redux-promise';
//import createSocketMiddleware from './socketMiddleware';
import loggerMiddleware from 'redux-logger';
import SocketAPI from './SocketClient';
import compConfig from '@/components/modules/Config';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history from './history';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
const uuid = require('uuid/v1');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initData = [{
  exchange: "SH",
  stockCode: "000001",
  uuid: "SH.000001",
  stockName: "上证指数",
  stockStatus: 2,
  ccyCode: "CNY",
  unit: 100,
  priceStep: 2.0,
  codeNumber: 1,
  securityType: 10,
  asset: 4,
  area: "null",
  industry: "null",
  subnew: 0,
  tradflag: 0,
  digit: 2,
  stockpysht: "null",
  isNotDel: true,
  upDataTime: '--'
}, {
  exchange:"SZ",
  stockCode:"399001",
  uuid:"SZ.399001",
  stockName:"深证成指",
  stockStatus:2,
  ccyCode:"CNY",
  unit:100,
  priceStep:2.0,
  codeNumber:399001,
  securityType:15,
  asset:4,
  area:"null",
  industry:"null",
  subnew:0,
  tradflag:0,
  digit:2,
  stockpysht:"null",
  isNotDel: true,
  upDataTime: '--'
}, {
  exchange:"SH",
  stockCode:"600999",
  uuid:"SH.600999",
  stockName:"招商证券",
  stockStatus:2,
  ccyCode:"CNY",
  unit:100,
  priceStep:2.0,
  codeNumber:600999,
  securityType:0,
  asset:0,
  area:"广东省",
  industry:"非银金融",
  subnew:0,
  tradflag:1,
  digit:2,
  stockpysht:"null",
  upDataTime: '--'
}]

function envVarInit() {
  /* *************
   * 寄托于window的环境变量初始化
   * superMonitor: 用于socket请求监控
   * selfOptions: 用于自选股存储
   * ************/
  window.superMonitor = {
    monitorDate: parseInt(moment().format('YYYMMDD')),
    app_uuid: uuid(),
    errors: [],
    isInThePlate: true
  };
  window.selfOptions = [];
  window.glbjList = [];
  // 键盘精灵的绝对控制
  window.canKeyBoard = true;
  // 用于自选交互暂存数据
  window.currentSelfOption = {};
  // 用于控制重新发起订阅操作
  window.reSub = true;
  // 当前选中项
  window.currentSelectItem = {};
}

//store创建函数
export default (initialState = {}) => {
  envVarInit();

  console.log('初始化仓库');
  let socket = new SocketAPI();
  socket.connect();
  //const socketMiddleware = createSocketMiddleware(socket);
  initialState.Data = { config: compConfig };
  window.socket = socket;
  localStorage.getItem('option-ALL')
  let optionData = localStorage.getItem('option-ALL') || '{"data": []}';
  if (optionData) {
    optionData = JSON.parse(optionData);
    optionData.data.length === 0 && (optionData.data = [...initData, ...optionData.data], optionData.count = 3, optionData.duuid = uuid(), optionData.startNum = 0);
    if (optionData.data && optionData.data.length > 0) {
      initialState.Data['option-ALL'] = optionData;
      window.selfOptions = _cloneDeep(optionData.data);
      optionData.data.forEach(item => {
        let key = `option-${item.asset}`;
        if (!initialState.Data[key]) initialState.Data[key] = { data: [],
           count: 0, duuid: uuid(), startNum: 0 };
        initialState.Data[key].data.push(item);
        initialState.Data[key].count += 1;
      })
    }
  }

  const store = createStore(
    connectRouter(history)(reducers),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        promiseMiddleware,
        //socketMiddleware,
        //loggerMiddleware
      )
    )
  )
  return store;
}

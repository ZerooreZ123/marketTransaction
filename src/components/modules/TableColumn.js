import React,{Component} from 'react';

const sampleOneMap = {
  // 个股返回数据样例
  "date": "日期", // 20180731,
  "time": "时间", // 150003000,
  "stockBasic": {
    "exchange": "SZ",
    "stockCode": "000001",
    "stockName": "平安银行",
    "stockStatus": 2,
    "asset": 0,
    "ccyCode": "CNY",
    "unit": 100,
    "codeNumber": 1,
    "uuid": "SZ.000001",
    "area": "广东省",
    "industry": "银行",
    "priceStep": 2,
    "subnew": 0,
    "tradflag": 1,
    "digit": 2
  },
  //"preClose": "昨收", // 9.39,
  //"high": "最高", // 9.49,
  //"open": "开盘", // 9.37,
  //"low": "最低", // 9.25,
  //"close": "现价", // 9.42,
  //"nowVolume": "现量", // 1265300,
  //"volume": "成交总量", // 72015080,
  //"amount": "成交金额", // 674484650,
  //"ask1Price": "卖一价", // 0,
  "ask1Volume": "卖一量", // 50520,
  //"bid1Price": "买一价", // 0,
  "bid1Volume": "买一量", // 363700,
  //"netChange": "涨跌", // 0.03,
  //"netChangeRatio": "涨跌幅", // 0.32,
  //"amplitudeRatio": "振幅", // 2.56,
  //"turnoverRatio": "换手率", // 0.43,
  //"volumeRatio": "量比", // 0,
  //"quoteRatio": "委比", // 2.73,
  //"quoteMargin": "委差", // 70145,
  //"speedRatio": "涨速率", // 0,
  //"peRatio": "市盈率", // 6.67,
  //"pbRatio": "市净率", // 0.82,
  //"psRatio": "市销率", // 34787672064,
  //"currencyValue": "流通市值", // 159367462512.42,
  //"capitalization": "总市值", // 161745275067.72,
  //"innerVolume": "内盘数量", // 632650,
  //"outerVolume": "外盘数量", // 632650,
  "dealCount": "成交笔数", // 1,
  "bigInflows": "大资金流入", // 5959563,
  "bigOutflows": "大资金流出", // 5959563,
  "bigNetflows": "大资金净流入", // 0,
  "sumInflows": "总资金流入", // 5959563,
  "sumOutflows": "总资金流出", // 5959563,
  "sumNetflows": "总资金净流入", // 0,
  //"avgPrice": "均价", // 93658,
  //"currencyVolume": "流通股本", // 1691798.97,
  //"capitalVolume": "总股本", // 1717041.14,
  "exchange": "SZ",
  "stockCode": "000001",
  "stockName": "平安银行",
  "stockStatus": 2,
  "asset": 0,
  "ccyCode": "CNY",
  "unit": 100,
  "codeNumber": 1,
  "uuid": "SZ.000001",
  "area": "广东省",
  "industry": "银行",
  "priceStep": 2,
  "subnew": 0,
  "tradflag": 1,
  "digit": 2,
  "netChangeNum": "", // "-/-",
  "isOption": false
}

const sambleBoardMap = {
  // 板块返回数据样例
  "date": 20180731,
  "time": 150014000,
  "stockBasic": {
    "exchange": "INDEX",
    "stockCode": "107383",
    "stockName": "银行",
    "asset": 4,
    "codeNumber": 107383,
    "uuid": "INDEX.107383",
    "industry": "10"
  },
  //"preClose": 999.1,
  //"high": 1006.68,
  //"open": 999.1,
  //"low": 987.34,
  //"close": 1002.29,
  //"volume": 1391690788,
  //"amount": 9737327766,
  //"netChange": 3.19,
  //"netChangeRatio": 0.32,
  //"amplitudeRatio": 1.94,
  //"turnoverRatio": 0.13,
  //"volumeRatio": 0,
  //"speedRatio": 0,
  //"currencyValue": 5973677326257.18,
  //"avgPrice": 7449999,
  //"currencyVolume": 106848212.65,
  //"capitalVolume": 161221234.51,
  "nowPrice": 1002.29,
  "RiseVolume": 19,
  "FallVolume": 4,
  //"nowAvgDiff": 25.670024871826172,
  "exchange": "INDEX",
  "stockCode": "107383",
  "stockName": "银行",
  "asset": 4,
  "codeNumber": 107383,
  "uuid": "INDEX.107383",
  "industry": "10",
  //"netChangeNum": "19/4"
}

export function setClass(data, key, config){
  if((config.zeroReplace && parseInt(data[key]) === 0)
    || data.bid1Price === '停牌'){
    return 'uuuer';
  }
  let temp = parseFloat(data[key]) - parseFloat(data.preClose);
  return temp !== 0 && (temp > 0? 'under': 'upper') || 'uuuer';
}

export function setClassByZero(data, key){
  if(data.bid1Price === '停牌'){
    return 'uuuer'
  }
  return data[key] !== 0 && (data[key] > 0? 'under': 'upper') || 'uuuer';
}

const showType = {
  origin: 'origin',
  price: 'price'
}

const showTypeMap = {
  date: showType.origin,
  upDataTime: showType.origin,
  stockCode: showType.origin,
  stockName: showType.origin,
  close: showType.price,
  high: showType.price,
  open: showType.price,
  low: showType.price,
  bid1Price: showType.price,
  ask1Price: showType.price,
  preClose: showType.price,
  avgPrice: showType.price
}

let sampleOneColumn = [
  {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
  {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'bid1Price', title: '买价', setClass, zeroReplace: '--'},
  {dataIndex: 'ask1Price', title: '卖价', setClass, zeroReplace: '--'},
  {dataIndex: 'nowVolume', title: '现量', isSorter: true, isNum: true, setClass: 'yellow'},//
  {dataIndex: 'speedRatio', title: '涨速%', setClass: setClassByZero},
  {dataIndex: 'turnoverRatio', title: '换手%'},
  {dataIndex: 'open', title: '今开', setClass, zeroReplace: '--'},
  {dataIndex: 'high', title: '最高', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'low', title: '最低', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'preClose', title: '昨收', zeroReplace: '--'},
  {dataIndex: 'peRatio', title: '市盈率%'},
  {dataIndex: 'capitalization', title: '总市值'},
  {dataIndex: 'volumeRatio', title: '量比%'},
  {dataIndex: 'amplitudeRatio', title: '振幅%'},
  {dataIndex: 'avgPrice', title: '均价', setClass},
  {dataIndex: 'date', title: '最新日期', isSorter: true},//
  {dataIndex: 'innerVolume', title: '内盘', isNum: true},
  {dataIndex: 'outerVolume', title: '外盘', isNum: true},
  {dataIndex: 'volume', title: '成交总量', isNum: true, isSorter: true},//
  {dataIndex: 'amount', title: '成交金额', isSorter: true},//
  {dataIndex: 'currencyValue', title: '流通市值'},
  {dataIndex: 'capitalVolume', title: '总股本'},
  {dataIndex: 'currencyVolume', title: '流通股本'},
  {dataIndex: 'pbRatio', title: '市净率'},
  {dataIndex: 'psRatio', title: '市销率'},

  {dataIndex: 'quoteRatio', title: '委比', setClass: setClassByZero},
  {dataIndex: 'quoteMargin', title: '委差', setClass: setClassByZero},
  {dataIndex: 'dealCount', title: '成交笔数', isNum: true},
  {dataIndex: 'bigInflows', title: '大资流入'},
  {dataIndex: 'bigOutflows', title: '大资流出'},
  {dataIndex: 'bigNetflows', title: '大资净流入'},
  {dataIndex: 'sumInflows', title: '总资流入'},
  {dataIndex: 'sumOutflows', title: '总资流出'},
  {dataIndex: 'sumNetflows', title: '总资净流入'},
];
sampleOneColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let sampleBoardColumn = [
  {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
  {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'bid1Price', title: '买价', setClass, zeroReplace: '--'},//
  {dataIndex: 'ask1Price', title: '卖价',setClass, zeroReplace: '--'},//
  {dataIndex: 'volume', title: '总量', isSorter: true, isNum: true},//
  {dataIndex: 'nowVolume', title: '现量', isSorter: true, isNum: true},//
  {dataIndex: 'speedRatio', title: '涨速%', setClass: setClassByZero},
  // {dataIndex: 'upDataTime', title: '自选日'},
  {dataIndex: 'turnoverRatio', title: '换手%'},
  {dataIndex: 'open', title: '今开', setClass, zeroReplace: '--'},
  {dataIndex: 'high', title: '最高', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'low', title: '最低', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'preClose', title: '昨收', zeroReplace: '--'},
]
sampleBoardColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let comprehensivePlateColumn = [
  {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
  {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
  // {dataIndex: 'bid1Price', title: '买价', setClass},//
  // {dataIndex: 'ask1Price', title: '卖价',setClass},//
  {dataIndex: 'volume', title: '总量', isSorter: true, isNum: true},//
  // {dataIndex: 'nowVolume', title: '现量', isSorter: true, isNum: true},//
  {dataIndex: 'speedRatio', title: '涨速%', setClass: setClassByZero},
  // {dataIndex: 'upDataTime', title: '自选日'},
  {dataIndex: 'turnoverRatio', title: '换手%'},
  {dataIndex: 'open', title: '今开', setClass, zeroReplace: '--'},
  {dataIndex: 'high', title: '最高', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'low', title: '最低', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'preClose', title: '昨收', zeroReplace: '--'},
]
comprehensivePlateColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let comprehensivePlateOptionColumn = [
  {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
  {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'bid1Price', title: '买价', setClass, zeroReplace: '--'},
  {dataIndex: 'ask1Price', title: '卖价', setClass, zeroReplace: '--'},
  {dataIndex: 'upDataTime', title: '自选日', isSorter: true},
]

comprehensivePlateOptionColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let optionStockColumn = [
  {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
  {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
  {dataIndex: 'bid1Price', title: '买价', setClass, zeroReplace: '--'},//
  {dataIndex: 'ask1Price', title: '卖价',setClass, zeroReplace: '--'},//
  {dataIndex: 'volume', title: '总量', isSorter: true, isNum: true},//
  {dataIndex: 'nowVolume', title: '现量', isSorter: true, isNum: true},//
  {dataIndex: 'speedRatio', title: '涨速%', setClass: setClassByZero},
  {dataIndex: 'upDataTime', title: '自选日', isSorter: true},
  {dataIndex: 'turnoverRatio', title: '换手%'},
  {dataIndex: 'open', title: '今开', setClass, zeroReplace: '--'},
  {dataIndex: 'high', title: '最高', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'low', title: '最低', isSorter: true, setClass, zeroReplace: '--'},//
  {dataIndex: 'preClose', title: '昨收', zeroReplace: '--'},
]
optionStockColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let quoteDetailColumn = [
  {dataIndex: 'stockName', title: '名称', isReload: true, width: 70},
  {dataIndex: 'stockCode', title: '代码', width: 70},
  {dataIndex: 'close', title: '现价', setClass, width: 70, zeroReplace: '--'}, //
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero, width: 70},//
]
quoteDetailColumn.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let quoteDetailColumnHs = [
  {dataIndex: 'stockName', title: '名称', isReload: true, width: 80},
  {dataIndex: 'stockCode', title: '代码', width: 70},
  {dataIndex: 'close', title: '现价', setClass, zeroReplace: '--'}, //
  {dataIndex: 'turnoverRatio', title: '换手%', isSorter: true, setClass: setClassByZero},
]
quoteDetailColumnHs.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

let quoteDetailColumnGL = [
  {dataIndex: 'stockName', title: '名称', isFixed: true, width: 100},
  {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
  {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
]
quoteDetailColumnGL.map(item => showTypeMap[item.dataIndex] && (item.showTyped = showTypeMap[item.dataIndex]))

export {
  showTypeMap, showType, quoteDetailColumnGL, quoteDetailColumnHs,
  quoteDetailColumn, optionStockColumn, sampleOneColumn, comprehensivePlateColumn,
  sampleBoardColumn, comprehensivePlateOptionColumn
}

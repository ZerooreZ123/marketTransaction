import {setClass, setClassByZero, sampleBoardColumn} from './TableColumn.js';
import {fsChartConfig, rkChartConfig} from './ChartCommonConfig';
const configBox = {};

configBox.CustomizeSelfOption = {
  compType: 'table',
  tabTitle: ['自选', '沪深'],
  actionName: ['option-ALL', 'option-0'],
  tableProps: {
    defaultSort: 'upDataTime_asc',
    RNFlag: 'stockCode',
    tableType: 'option',
    columns: [
      {dataIndex: 'order', title: '序号', isFixed: true, width: 45},
      {dataIndex: 'stockCode', title: '代码', isFixed: true, width: 70},
      {dataIndex: 'stockName', title: '名称',  isFixed: true, isReload: true, width: 100},
      {dataIndex: 'netChangeRatio', title: '涨幅%', isSorter: true, setClass: setClassByZero},//
      {dataIndex: 'close', title: '现价', setClass}, //
      {dataIndex: 'netChange', title: '涨跌', isSorter: true, setClass: setClassByZero},//
      {dataIndex: 'bid1Price', title: '买价', setClass},
      {dataIndex: 'ask1Price', title: '卖价', setClass},
    ],
  }
}

configBox.CustomizeNewsletter = {
  compType: 'news',
  actionName: 'livelist',
  newsProps: {
    columns: {
      'livelist': ['pubtime', 'content'],
    }
  }
}

configBox.CustomizeNews = {
  compType: 'news',
  actionName: 'newslist',
  newsProps: {
    columns: {
      'newslist': ['pubtime', 'title'],
    }
  }
}

configBox.CustomizeKX = {
  compType: 'chart',
  actionName: 'SH.000001-13',
  chartType: "k",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: rkChartConfig,
  }
}

configBox.CustomizeFS = {
  compType: 'chart',
  actionName: 'SH.000001-7',
  chartType: "f",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.CustomizeRankSH = {
  compType: 'change',
  actionName: 'SH.000001-18',
  changeProps: {
    columns: ['stockName', 'netChangeRatio', 'speedRatio'],
  }
}

configBox.CustomizeRankSZ = {
  compType: 'change',
  actionName: 'SZ.399001-18',
  changeProps: {
    columns: ['stockName', 'netChangeRatio', 'speedRatio'],
  }
}

configBox.CustomizeZS = {
  compType: 'chart',
  tabTitle: ['上证指数','沪深300', '上证50', 'B股指数', '深证成指', '中小板指', '创业板指', '深证综指', '成份B指', '恒生指数'],
  actionName: ['SH.000001-7-17','SH.000300-7-17', 'SH.000050-7-17', 'SH.000003-7-17', 'SZ.399001-7-17', 'SZ.399005-7-17', 'SZ.159915-7-17', 'SZ.399106-7-17', 'SZ.399003-7-17', 'SZ.399003-7-17'],
  chartType: "f",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

export default configBox;

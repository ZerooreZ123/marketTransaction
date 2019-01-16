import {comprehensivePlateOptionColumn, setClass, setClassByZero, sampleBoardColumn,comprehensivePlateColumn} from './TableColumn.js';
import {fsChartConfig, rkChartConfig} from './ChartCommonConfig';
const configBox = {};

configBox.ComplexChartHSB = {
  compType: 'chart',
  tabTitle: ['上证指数','沪深300', '上证50'],
  actionName: ['SH.000001-7-17','SH.000300-7-17', 'SH.000016-7-17'],
  chartType: "f",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ComplexChartSZCSC = {
  compType: 'chart',
  tabTitle: ['深证成指', '中小板指'],
  actionName: ['SZ.399001-7-17', 'SZ.399005-7-17'],
  chartType: "f",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ComplexChartHH = {
  compType: 'chart',
  tabTitle: ['创业板指'],
  actionName: ['SZ.399006-7-17'],
  chartType: "f",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ComplexChartFK = {
  compType: 'chart',
  tabTitle: ['分时', 'K线 '],
  actionName: ['SH.600999-7-6', 'SH.600999-13-6'],
  chartType: "fk",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: [fsChartConfig, rkChartConfig],
  }
}

configBox.ComplexTableQHGFDT = {
  compType: 'table',
  tabTitle: ['全部', '行业', '地区', '概念'],
  actionName: ['SECT_ALL-19', '10-19', '30-19', '40-19'],
  autoWidth: true,
  tableProps: {
    RNFlag: 'stockCode',
    // isHeader: true,
    defaultSort: 'netChangeRatio_desc',
    columns: comprehensivePlateColumn,
  }
}

configBox.ComplexTableZGQQ = {
  compType: 'table',
  tabTitle: ['自选', '沪深'],
  actionName: ['option-ALL', 'option-0'],
  autoWidth: true,
  tableProps: {
    defaultSort: 'upDataTime_asc',
    RNFlag: 'stockCode',
    tableType: 'option',
    columns: comprehensivePlateOptionColumn,
  }
}

configBox.ComplexRankShZAG = {
  compType: 'change',
  actionName: 'SH.000001-18',
  changeProps: {
    columns: ['stockName', 'netChangeRatio', 'speedRatio'],
    title: '上证A股',
  }
}

configBox.ComplexRankSzZAG = {
  compType: 'change',
  actionName: 'SZ.399001-18',
  changeProps: {
    columns: ['stockName', 'netChangeRatio', 'speedRatio'],
    title: '深证A股',
  }
}

configBox.ComplexNewsKC = {
  compType: 'news',
  tabTitle: ['快讯直播', '财经要闻'],
  actionName: ['livelist', 'newslist'],
  newsProps: {
    columns: {
      livelist: ['fullData', 'content'],
      newslist: ['fullData', 'title']
    }
  }
}

export default configBox;

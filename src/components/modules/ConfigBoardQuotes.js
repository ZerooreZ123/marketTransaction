/* *****************
 * List: 行情列表
 *   HSGP: 沪深股票
 *     Chart: 图表
 *       ShZZS: 上证指数
 *       SzZZS: 深证指数
 *       CYBZS: 创业版指数
 *       FS: 分时
 *       KX: K线
 * ****************/
import {sampleOneColumn, sampleBoardColumn} from './TableColumn.js';
import {fsChartConfig, rkChartConfig} from './ChartCommonConfig';
const configBox = {};

configBox.BoardChartOne = {
  compType: 'chart',
  tabTitle: ['分时', 'K线 '],
  actionName: ['SZ.000776-7', 'SH.600000-7'],
  chartType: "fk",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: [fsChartConfig, rkChartConfig],
  }
}

configBox.BoardChartTwo = {
  compType: 'chart',
  tabTitle: ['分时', 'K线 '],
  actionName: ['SZ.000776-7', 'SH.600000-7'],
  chartType: "fk",
  chartProps:{
    title:'',
    axisNumY: 1,
    cycleBarConfig: [fsChartConfig, rkChartConfig],
  }
}

configBox.BoardTableOne = {
  compType: 'table',
  tabTitle: ['全部板块', '行业板块', '概念板块', '地区板块'],
  actionName: ['SECT_ALL-19', '10-19', '40-19', '30-19'],
  autoWidth: true,
  tableProps: {
    isHeader: true,
    RNFlag: 'stockCode',
    defaultSort: 'netChangeRatio_desc',
    columns: sampleBoardColumn
  }
}

configBox.BoardTableTwo = {
  compType: 'table',
  actionName: 'count',
  autoWidth: true,
  tableProps: {
    isHeader: true,
    RNFlag: 'stockCode',
    defaultSort: 'netChangeRatio_desc',
    columns: sampleOneColumn,
  }
}

export default configBox;

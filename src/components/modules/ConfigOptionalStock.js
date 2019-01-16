import {sampleBoardColumn,optionStockColumn} from './TableColumn.js';
import {fsChartConfig, rkChartConfig} from './ChartCommonConfig';
const configBox = {};

configBox.OptionChartLeft = {
  compType: 'chart',
  actionName: 'SH.600999-13-6',
  chartType: "k",
  chartProps:{
    title:'K线',
    axisNumY: 1,
    cycleBarConfig: rkChartConfig,
  }
}

configBox.OptionChartRight = {
  compType: 'chart',
  actionName: 'SH.600999-7-6',
  chartType: "f",
  chartProps:{
    title:'分时',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}


configBox.OptionTableQHGZJQQ = {
  compType: 'table',
  tabTitle: ['全部', '沪深'],
  actionName: ['option-ALL', 'option-0'],
  autoWidth: true,
  tableProps: {
    isHeader: true,
    tableType: 'option',
    RNFlag: 'stockCode',
    defaultSort: 'upDataTime_asc',
    columns: optionStockColumn
  }
}

export default configBox;

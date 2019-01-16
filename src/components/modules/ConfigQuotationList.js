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
import configBase from './ConfigBase.js';
import {sampleOneColumn} from './TableColumn.js';
import {fsChartConfig, rkChartConfig} from './ChartCommonConfig';

const configBox = {};


//沪深股票指数
configBox.ListHSGPChartShZZS = {
  compType: 'chart',
  actionName: 'SH.000001-7-17',
  chartType: "f",
  chartProps:{
    title:'上证指数',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ListHSGPChartSzZZS = {
  compType: 'chart',
  actionName: 'SZ.399001-7-17',
  chartType: "f",
  chartProps:{
    title:'深证指数',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ListHSGPChartCYBZS = {
  compType: 'chart',
  actionName: 'SZ.399006-7-17',
  chartType: "f",
  chartProps:{
    title:'创业板指数',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}


//债券指数
configBox.ListHSGPChartGZZS = {
  compType: 'chart',
  actionName: 'SH.000012-7-6',
  chartType: "f",
  chartProps:{
    title:'国债指数',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ListHSGPChartGSZS = {
  compType: 'chart',
  actionName: 'SH.000923-7-6',
  chartType: "f",
  chartProps:{
    title:'公司指数',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ListHSGPChartZZZZ = {
  compType: 'chart',
  actionName: 'SH.000832-7-6',
  chartType: "f",
  chartProps:{
    title:'中证转债',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}


configBox.ListHSGPChartFS = {
  compType: 'chart',
  actionName: 'SH.000001-13',
  chartType: "k",
  chartProps:{
    title:'K线',
    axisNumY: 1,
    cycleBarConfig: rkChartConfig,
  }
}

configBox.ListHSGPChartKX = {
  compType: 'chart',
  actionName: 'SH.000001-7',
  chartType: "f",
  chartProps:{
    title:'分时',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}


// configBox.ListHSGPTable = {
//   compType: 'table',
//   tabTitle: ['分类', 'A股', '中小', '创业', 'B股'],
//   actionName: ['all', 'AG-19', 'SZZXB-19', 'SZCYB-19', 'BG-19'],
//   autoWidth: true,
//   tabMap: {
//     all: {
//       type: 'dropdown',
//       data: [
//         {title: '行业', action: 'industry'},
//         {title: '概念', action: 'concept'}
//       ]
//     }
//   },
//   tableProps: {
//     isHeader : true,
//     columns: sampleOneColumn,
//   }
// }

configBox.ListHSGPTable = {
  compType: 'table',
  tabTitle: ['分类', 'A股', '中小', '创业', 'B股'],
  actionName: ['all', 'AG-19', 'SZZXB-19', 'SZCYB-19', 'BG-19'],
  autoWidth: true,
  tabMap: {
    all: {
      type: 'handler',
    }
  },
  tableProps: {
    RNFlag: 'stockCode',
    isHeader : true,
    defaultSort: 'netChangeRatio_desc',
    columns: sampleOneColumn,
  }
}

configBox.ListGGTable = {
  compType: 'table',
  tabTitle: ['港板块', '港行业', '香港指数', '香港主板', '香港创业板', '香港信托基金', 'AH股对照', 'ADR股对照', 'B股转H股', '港股通'],
  actionName: ['hkboard', 'hk', 'all', 'industry', 'concept', 'style', 'area', 'industry', 'concept', 'style', 'area'],
  autoWidth: true,
  tabMap: {
    hkboard: {
      type: 'dropdown',
      data: [
        {title: '行业', action: 'industry'},
        {title: '概念', action: 'concept'}
      ]
    },
    hk: {
      type: 'dropdown',
      data: [
        {title: '行业', action: 'industry'},
        {title: '概念', action: 'concept'}
      ]
    }
  },
  tableProps: {
    columns: configBase.getColumns([
      {main: '序号', fixed: 'left',  isSorter:false}, {main: '代码', fixed: 'left'}, {main: '名称', fixed: 'left'},
      '涨幅', '现价', '涨跌',
      '买价', '卖价', '总量', ' 现量', '涨速', {main: '换手', width: null},
    ]),
    size: 'small',
    pagination: false
  }
}

configBox.ListQHTable = {
  compType: 'table',
  tabTitle: ['期货品种', '期货指数', '期货连续', '主力合约', '中金所期货', '郑州商品', '大连商品', '上海商品'],
  actionName: ['hkboard', 'all', 'industry', 'conc ept', 'style', 'area', 'industry', 'concept', 'style'],
  autoWidth: true,
  tabMap: {
    hkboard: {
      type: 'dropdown',
      data: [
        {title: '行业', action: 'industry'},
        {title: '概念', action: 'concept'}
      ]
    },
  },
  tableProps: {
    columns: configBase.getColumns([
      {main: '序号', fixed: 'left',  isSorter:false}, {main: '代码', fixed: 'left'}, {main: '名称',fixed: 'left'},
      '涨幅', '现价',
      '买价', '卖价', '现量', '涨速', '买量', '卖量', '涨跌', '总量',
      '总金额', '持仓量', '仓差', '结算价', '溢价', '沉淀资金', '资金流向',
      '投机度', '量比', '振幅%', {main: '总量', width: null},
    ]),
    size: 'small',
    pagination: false
  }
}

configBox.ListQHChartKX = {
  compType: 'chart',
  actionName: 'stockIndex',
  chartType: 'f',
  chartProps: {
    title: 'K线',
    axisNumY: 1,
    cycleBarConfig: rkChartConfig,
  }
}

configBox.ListQHChartFS = {
  compType: 'chart',
  actionName: 'stockIndex',
  chartType: 'f',
  chartProps: {
    title: '分时',
    axisNumY: 1,
    cycleBarConfig: fsChartConfig,
  }
}

configBox.ListQQTable = {
  compType: 'table',
  actionName: 'concept',
  autoWidth: true,
  tableProps: {
    columns: configBase.getColumns([
      {main: '序号', fixed: 'left',  isSorter:false}, {main: '代码', fixed: 'left'}, {main: '名称',  fixed: 'left'},
      '涨幅', '现价',
      '买价', '卖价', '现量', '涨速', '买量', '卖量', '涨跌', '总量',
      '总金额', '持仓量', '仓差', '结算价', '溢价', '沉淀资金', '资金流向',
      '投机度', '量比', '振幅%', {main: '总量', width: null},
    ]),
    size: 'small',
    pagination: false
  }
}

configBox.ListJJTable = {
  compType: 'table',
  tabTitle: ['分类','基金'],
  actionName: ['all','FUND-19'],
  autoWidth: true,
  tabMap: {
    all: {
      type: 'handler',
    }
  },
  tableProps: {
    isHeader: true,
    defaultSort: 'netChangeRatio_desc',
    RNFlag: 'stockCode',
    columns: sampleOneColumn
  }
}

// configBox.ListJJTable = {
//   compType: 'table',
//   tabTitle: ['沪深基金', '交易所基金', '开放式基金', '货币型基金'],
//   actionName: ['hkboard', 'concept', 'style', 'area'],
//   autoWidth: true,
//   tabMap: {
//     hkboard: {
//       type: 'dropdown',
//       data: [
//         {title: '行业', action: 'industry'},
//         {title: '概念', action: 'concept'}
//       ]
//     },
//   },
//   tableProps: {
//     columns: configBase.getColumns([
//       '序号', {main: '名称', isSorter: false}, '代码', '涨幅', '现价',
//       '买价', '卖价', '现量', '涨速', '买量', '卖量', '涨跌', '总量',
//       '总金额', '持仓量', '仓差', '结算价', '溢价', '沉淀资金', '资金流向',
//       '投机度', '量比', '振幅%'
//     ]),
//     size: 'small',
//     pagination: false
//   }
// }

configBox.ListZQTable = {
  compType: 'table',
  tabTitle: ['分类','债券'],
  actionName: ['all','BOND-19'],
  autoWidth: true,
  tabMap: {
    all: {
      type: 'handler',
    }
  },
  tableProps: {
    isHeader:true,
    defaultSort: 'netChangeRatio_desc',
    RNFlag: 'stockCode',
    columns: sampleOneColumn
  }
}

export default configBox;

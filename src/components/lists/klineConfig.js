import React from 'react';
import { format } from "d3-format";
import _max from 'lodash/max';
import _min from 'lodash/min';
import {transfromData} from '@/utils/FormatUtils';
import {
  YGZFSeries,
  MACDSeries,
  LineCommonSeries,
} from "@/components/react-stockcharts/lib/series";
import plusSvg from "@/resources/images/plus_svg.png";
import minusSvg from "@/resources/images/minus_svg.png";
import rightSvg from "@/resources/images/right_svg.png";
import leftSvg from "@/resources/images/left_svg.png";
import panSvg from "@/resources/images/pan_svg.png";
import saveSvg from "@/resources/images/save_svg.png";
const styleConfig = require('@/theme/')();

export const cycleBarConfig = [{
  title: '分时',
  type: 7,
  barConfig: ['save', 'overlay', 'tool', 'drawer'],
  divide: 100,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  hasNewData: true,
  hasStop: true,
  name: 'DIVHOUR',
  normConfig: 1,
  defaultNorm: ['VOLFS'],
}, {
  title: '日K',
  type: 13,
  divide: 100,
  format: "%Y-%m-%d",
  panelFormat: "%Y-%m-%d",
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'DAY',
  normConfig: 2,
  defaultNorm: ['VOLKX'],
}, {
  title: '周K',
  type: 20,
  divide: 100,
  format: "%Y-%m-%d",
  panelFormat: "%Y-%m-%d",
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  normConfig: 2,
  defaultNorm: ['VOLKX'],
  name: 'WEEK'
}, {
  title: '月K',
  type: 21,
  divide: 100,
  format: "%Y-%m-%d",
  panelFormat: "%Y-%m-%d",
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  normConfig: 2,
  defaultNorm: ['VOLKX'],
  name: 'MONTH'
}, {
  title: '年K',
  type: 22,
  divide: 10000,
  format: "%Y-%m-%d",
  panelFormat: "%Y-%m-%d",
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  normConfig: 2,
  defaultNorm: ['VOLKX'],
  name: 'YEAR'
}, {
  title: '1分',
  type: 8,
  divide: 10000,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  realTime: true,
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'M1',
  defaultNorm: ['VOLKX'],
  normConfig: 2,
}, {
  title: '5分',
  type: 9,
  divide: 10000,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  realTime: true,
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'M5',
  defaultNorm: ['VOLKX'],
  normConfig: 2,
}, {
  title: '15分',
  type: 10,
  divide: 10000,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  realTime: true,
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'M15',
  defaultNorm: ['VOLKX'],
  normConfig: 2,
}, {
  title: '30分',
  type: 11,
  divide: 10000,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  realTime: true,
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'M30',
  defaultNorm: ['VOLKX'],
  normConfig: 2,
}, {
  title: '60分',
  type: 12,
  divide: 10000,
  format: "%H:%M",
  panelFormat: "%Y-%m-%d    %H:%M",
  realTime: true,
  barConfig: ['save', 'overlay', 'tool', 'smaller', 'bigger', 'seter', 'drawer'],
  name: 'M60',
  defaultNorm: ['VOLKX'],
  normConfig: 2,
}]

export const barConfig = {
  save: {
    title: '保存',
    icon: saveSvg
  },
  tool: {
    title: '工具',
    icon: panSvg
  },
  smaller: {
    title: '缩小',
    icon: minusSvg
  },
  bigger: {
    title: '放大',
    icon: plusSvg
  },
  drawer: {
    title: ['缩起', '扩充'],
    icon: [leftSvg, rightSvg]
  }
  //seter: 'setting'
}

export const reinstatementTypeConfig = {
  default: 'not',
  config: [{
    value: 'not',
    title: '不复权'
  }, {
    value: 'front',
    title: '前复权'
  }, {
    value: 'back',
    title: '后复权'
  }]
}

export const toolConfig = [{
  title: '常用',
  icons: [{
    title: '压/撑',
    icon: 'icon1'
  }, {
    title: '趋势',
    icon: 'icon2',
    drawType: 'XLINE',
    compType: 'TrendLine'
  }, {
    title: '矩形',
    icon: 'icon3'
  }, {
    title: '回归带',
    icon: 'icon4'
  }, {
    title: '弧形',
    icon: 'icon5'
  }, {
    title: '文本',
    icon: 'icon6'
  }],
}, {
  title: '线条',
  icons: [{
    title: '射线',
    icon: 'icon7',
    drawType: 'RAY',
    compType: 'TrendLine'
  }, {
    title: '线段',
    icon: 'icon8',
    drawType: 'LINE',
    compType: 'TrendLine'
  }, {
    title: '箭头',
    icon: 'icon9'
  }]
}, {
  title: '通道',
  icons: [{
    title: '通道',
    icon: 'icon10'
  }, {
    title: '回归射线',
    icon: 'icon11'
  }, {
    title: '线性回归',
    icon: 'icon12'
  }]
}, {
  title: '时空',
  icons: [{
    title: '黄金分割',
    icon: 'icon13'
  }, {
    title: '波段',
    icon: 'icon14'
  }, {
    title: '周期线',
    icon: 'icon15'
  }, {
    title: '百分比',
    icon: 'icon16'
  }, {
    title: '斐波拉契',
    icon: 'icon17'
  }]
}, {
  title: '形态',
  icons: [{
    title: '速阻线',
    icon: 'icon18'
  }, {
    title: '江恩角度线',
    icon: 'icon19'
  }, {
    title: '对称角度线',
    icon: 'icon20'
  }, {
    title: '三浪线',
    icon: 'icon21'
  }, {
    title: '五浪线',
    icon: 'icon22'
  }, {
    title: '八浪线',
    icon: 'icon23'
  }, {
    title: 'M头W底',
    icon: 'icon24'
  }, {
    title: '头肩型',
    icon: 'icon25'
  }, {
    title: '测距',
    icon: 'icon26'
  }]
}, {
  title: '清空',
  icons: [{
    title: '删除画线',
    icon: 'icon27',
    drawType: 'DeleteItem',
    compType: 'DeleteItem'
  }, {
    title: '删除当前品种的画线',
    icon: 'icon28'
  }, {
    title: '清空画线',
    icon: 'icon29',
    drawType: 'DeleteAll',
    compType: 'DeleteAll'
  }]
}];

const normConfig1 = {
  maxShowItemByLine: 1,
  maxShowItemByChart: 3,
  default: ['VOLFS'],
  config: [
    'VOLFS',
    'MACD',
  ]
};

const normConfig2 = {
  maxShowItemByLine: 1,
  maxShowItemByChart: 3,
  default: ['VOLKX'],
  config: [
    'VOLKX',
    'MA',
    'BOLL',
    'DMI',
    'KDJ',
    'DMA',
    'MACD',
    //'YGZF'
  ]
}

export const normBarConfig = Array.from(cycleBarConfig, cycle => [null, normConfig1, normConfig2][cycle.normConfig]);

export const indexConfig = {
  MACD: {
    title: 'MACD',
    type: 'MACD',
    showType: 'chart',
    series: MACDSeries,
    options: {
      SHORT: 12,
      LONG: 26,
      MID: 9,
    },
    tipConfig: {
      configs: [{
        name: 'DIF',
        key: 'DIF',
        stroke: styleConfig.kMacdDif,
      }, {
        name: 'DEA',
        key: 'DEA',
        stroke: styleConfig.kMacdDea,
      }, {
        name: 'MACD',
        key: 'MACD',
        stroke: d => d && (d > 0? styleConfig.kLineUnder2: styleConfig.kLineUpper2) || styleConfig.kMacdLabel,
      }],
      label: config => `MACD(${config.SHORT}, ${config.LONG}, ${config.MID})`,
      labelFill: styleConfig.kMacdLabel,
    },
    yExtentsFun: data => [_min([data.DIF, data.MACD, data.DEA]), _max([data.DIF, data.MACD, data.DEA])],
    yTickValues: data => [data[0], 0, data[1]],
  },
  MA: {
    title: 'MA',
    type: 'MA',
    showType: 'line',
    options: {
      M1: 5,
      M2: 10,
      M3: 20,
      M4: 60,
    },
    tipConfig: {
      configs: [{
        name: 'MA5',
        key: 'MA5',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'MA10',
        key: 'MA10',
        stroke: styleConfig.kAvgLineColor10,
      }, {
        name: 'MA20',
        key: 'MA20',
        stroke: styleConfig.kAvgLineColor20,
      }, {
        name: 'MA60',
        key: 'MA60',
        stroke: styleConfig.kAvgLineColor60,
      }],
      label: config => `MA(${config.M1}, ${config.M2}, ${config.M3}, ${config.M4})`,
    },
  },
  BOLL: {
    title: 'BOLL',
    type: 'BOLL',
    showType: 'line',
    options: {
      M: 20
    },
    avgConfig: [
      {color: styleConfig.kAvgLineColor5, key: 'UB', title: 'UB'},
      {color: styleConfig.kAvgLineColor10, key: 'LB', title: 'LB'},
      {color: styleConfig.kAvgLineColor20, key: 'BOLL', title: 'BOLL'},
    ],
    tipConfig: {
      configs: [{
        name: 'UB',
        key: 'UB',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'LB',
        key: 'LB',
        stroke: styleConfig.kAvgLineColor10,
      }, {
        name: 'BOLL',
        key: 'BOLL',
        stroke: styleConfig.kAvgLineColor20,
      }],
      label: config => `BOLL(${config.M})`,
    },
  },
  VOLKX: {
    title: 'VOLUME',
    type: false,
    showType: 'chart',
    series: LineCommonSeries,
    position: 'top',
    options: {},
    isNum: true,
    tipConfig: {
      configs: [{
        name: '成交量',
        key: 'volume',
        drawType: 'bar',
        stroke: d => d.close >= d.open ? styleConfig.kLineUnder2 : styleConfig.kLineUpper2
      }],
      label: config => '',
      labelFill: styleConfig.kMacdLabel,
      hasTipTool: false,
    },
    yExtentsFun: data => [0, data.volume]
  },
  VOLFS: {
    title: 'VOLUME',
    type: false,
    showType: 'chart',
    series: LineCommonSeries,
    position: 'top',
    options: {},
    isNum: true,
    tipConfig: {
      isNum: true,
      configs: [{
        name: '成交量',
        key: 'nowVolume',
        drawType: 'bar',
        stroke: d => d.bprice > d.price ? styleConfig.kLineUnder2 : styleConfig.kLineUpper2
      }],
      label: config => false,
      labelFill: styleConfig.kMacdLabel,
      hasTipTool: false,
    },
    yExtentsFun: data => [0, data.nowVolume]
  },
  DMI: {
    title: 'DMI',
    type: 'DMI',
    showType: 'chart',
    series: LineCommonSeries,
    options: {
      N: 14,
      M: 6,
    },
    tipConfig: {
      configs: [{
        name: 'PDI',
        key: 'PDI',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'MDI',
        key: 'MDI',
        stroke: styleConfig.kAvgLineColor10,
      }, {
        name: 'ADX',
        key: 'ADX',
        stroke: styleConfig.kAvgLineColor20,
      }, {
        name: 'ADXR',
        key: 'ADXR',
        stroke: styleConfig.kAvgLineColor60,
      }],
      label: config => `DMI(${config.N}, ${config.M})`,
      labelFill: styleConfig.kMacdLabel,
    },
    yExtentsFun: data => [_min([data.PDI, data.MDI, data.ADX, data.ADXR]), _max([data.PDI, data.MDI, data.ADX, data.ADXR])],
    yTickValues: data => [data[0], data[1]],
  },
  DMA: {
    title: 'DMA',
    type: 'DMA',
    showType: 'chart',
    series: LineCommonSeries,
    options: {
      N1: 10,
      N2: 50,
      M: 10
    },
    tipConfig: {
      configs: [{
        name: 'DIF',
        key: 'DMA_DIF',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'DIFMA',
        key: 'DMA_DIFMA',
        stroke: styleConfig.kAvgLineColor60,
      }],
      label: config => `DMA(${config.N1}, ${config.N2}, ${config.M})`,
      labelFill: styleConfig.kMacdLabel,
    },
    yExtentsFun: data => [_min([data.DMA_DIF, data.DMA_DIFMA]), _max([data.DMA_DIF, data.DMA_DIFMA])],
    yTickValues: data => [data[0], data[1]],
  },
  KDJ: {
    title: 'KDJ',
    type: 'KDJ',
    showType: 'chart',
    series: LineCommonSeries,
    options: {
      N: 9,
      M1: 3,
      M2: 3,
    },
    tipConfig: {
      configs: [{
        name: 'K',
        key: 'K',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'D',
        key: 'D',
        stroke: styleConfig.kAvgLineColor10,
      }, {
        name: 'J',
        key: 'J',
        stroke: styleConfig.kAvgLineColor20,
      }],
      label: config => `KDJ(${config.N}, ${config.M1}, ${config.M2})`,
      labelFill: styleConfig.kMacdLabel,
    },
    yExtentsFun: data => [_min([data.K, data.J, data.D]), _max([data.K, data.D, data.J])]
  },
  CCI: {
    title: 'CCI',
    type: 'CCI',
    showType: 'chart',
    series: LineCommonSeries,
    options: {
      N: 14,
    },
    tipConfig: {
      configs: [{
        name: 'K',
        key: 'K',
        stroke: styleConfig.kAvgLineColor5,
      }, {
        name: 'D',
        key: 'D',
        stroke: styleConfig.kAvgLineColor10,
      }, {
        name: 'J',
        key: 'J',
        stroke: styleConfig.kAvgLineColor20,
      }],
      label: config => `KDJ(${config.N})`,
      labelFill: styleConfig.kMacdLabel,
    },
    yExtentsFun: data => [_min([data.K, data.J, data.D]), _max([data.K, data.D, data.J])]
  },
  YGZF: {
    title: '定海神针',
    type: 'YGZF',
    showType: 'chart',
    series: YGZFSeries,
    tipConfig: {
      configs: [{
        name: '第二指标交叉线',
        key: 'secondIndLine',
        stroke: 'red',
        drawType: 'line',
      }, {
        name: '买入条件',
        key: 'buyLine',
        stroke: 'yellow',
        drawType: 'line',
      }, {
        name: '卖出',
        key: 'sellSign',
        stroke: 'red',
      }, {
        name: '高位线',
        key: 'highLine',
        stroke: 'red',
        default: 85,
        drawType: 'line',
      }, {
        name: '机会线',
        key: 'opportunityLine',
        stroke: 'green',
        default: 50,
      }, {
        name: '底线',
        key: 'baseLine',
        stroke: '#AAFF00',
        drawType: 'line',
        default: 0,
      }, {
        name: '买入',
        key: 'buySign',
        stroke: '#AAFF00',
      }],
      label: config => `定海神针`,
      labelFill: styleConfig.kMacdLabel,
    },
    yTickValues: data => [20, 50, 80],
    yExtentsFun: data => [_min([data.secondIndLine, data.buyLine, data.baseLine]), _max([data.highLine, data.HJ_12, data.HJ_12]) + 5]
  }
};

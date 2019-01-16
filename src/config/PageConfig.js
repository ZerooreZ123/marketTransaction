let config = {
  ZDF: {
    compName: 'ZDF', // 组件名
    compType: 'list',
    tabTitle: '上证A股 涨跌幅', // tabs中文名
    actionName: 'ZDF', // tabs英文名
    dataType: ['name', 'order', 'prise'], // 数据类型
  },
  ZDS: {
    compName: 'ZDS', // 组件名
    compType: 'list',
    tabTitle: '上证A股 涨跌速', // tabs中文名
    actionName: 'ZDS', // tabs英文名
    dataType: ['name', 'order', 'inSpeed'], // 数据类型
  },
  news: {
    compName: 'news', // 组件名
    compType: 'news',
    tabTitle: ['快讯直播', '财经要闻'], // tabs中文名
    actionName: ['quickNews', 'financialNews'], // tabs英文名
    dataType: ['time', 'title'], // 数据类型
  },
  mychart1: {
    compName: 'mychart1', // 组件名
    compType: 'chart',
    tabTitle: ['沪深300', '上证50', 'B股指数'], // tabs中文名
    actionName: ['sh300', 'sz50', 'stockIndex'], // tabs英文名
    dataType: [], // 数据类型
  },
  mychart2: {
    compName: 'mychart2', // 组件名
    compType: 'chart',
    tabTitle: ['深证成指', '中小板指', '创业板指', '深证综指', '成份B指'], // tabs中文名
    actionName: ['szcz', 'zxbz', 'cybz', 'szzz', 'cfbz'], // tabs英文名
    dataType: [], // 数据类型
  },
  mychart3: {
    compName: 'mychart3', // 组件名
    compType: 'chart',
    tabTitle: ['沪深指数', '恒生指数'], // tabs中文名
    actionName: ['huszs', 'heszs'], // tabs英文名
    dataType: [], // 数据类型
  },
  mychart4: {
    compName: 'mychart4', // 组件名
    compType: 'chart',
    tabTitle: ['分时', 'K线b '], // tabs中文名
    actionName: ['divhour', 'kline'], // tabs英文名
    dataType: [], // 数据类型
  },
  mychart5: {
    compName: 'mychart5', // 组件名
    compType: 'chart',
    tabTitle: ['分时', '日K', '多日', '周K', '月K', '1分', '5分', '15分', '30分', '60分'], // tabs中文名
    actionName: ['divhour', 'dkline', 'dskline', 'mkline', 'ykline', 'onef', 'fivef', 'fiff', 'thf', 'sif'], // tabs英文名
    dataType: [], // 数据类型
  },
  six: {
    compName: 'six', // 组件名
    compType: 'table',
    tabTitle: ['全部', '行业', '概念', '风格', '地区', '统计'], // tabs中文名
    actionName: ['all', 'industry', 'concept', 'style', 'area', 'count'], // tabs英文名
    dataType: [], // 数据类型
    size: 'small', // 组件大小
    pagination: false, // 是否分页
    columns: [{ // 表格列配置
        title: '序号', dataIndex: 'order',isSorter:false, width: 50, 
      }, {
        title: '代码', dataIndex: 'code', width: 80,
      }, {
        title: '名称', dataIndex: 'name',width: 80,
      }, {
        title: '涨幅', dataIndex: 'rise',width: 80,
      }, {
        title: '现价', dataIndex: 'prise',width: 80,
      }, {
        title: '涨跌', dataIndex: 'orderChange',width: 80,
      }
    ]
  },
  sixnext: {
    compType: 'table',
    compName: 'sixnext', // 组件名
    tabTitle: ['自选', '港股', '期权', '期货'], // tabs中文名
    actionName: ['count', 'area', 'concept', 'style'], // tabs英文名
    dataType: [], // 数据类型
    size: 'small', // 组件大小
    pagination: false, // 是否分页
    columns: [{ // 表格列配置
        title: '序号', dataIndex: 'order', isSorter:false, width: 50,
      }, {
        title: '代码', dataIndex: 'code',  width: 80,
      }, { 
        title: '名称', dataIndex: 'name', width: 80,
      }, {
        title: '涨幅', dataIndex: 'rise', width: 80,
      }, {
        title: '现价', dataIndex: 'prise', width: 80,
    }]
  },
  optionTable: {
    compType: 'table',
    compName: 'optionTable', // 组件名
    tabTitle: ['全部', '沪深', '港股', '债券', '基金', '期货', '期权'], // tabs中文名
    actionName: ['all', 'industry', 'concept', 'style', 'area', 'count', 'stock'], // tabs英文名
    dataType: [], // 数据类型
    size: 'small', // 组件大小
    pagination: false, // 是否分页
    columns: [{ // 表格列配置
        title: '序号', dataIndex: 'order', isSorter:false, width: 50,
      }, {
        title: '代码', dataIndex: 'code', width: 80,
      }, {
        title: '名称', dataIndex: 'name', width: 80,
      }, {
        title: '涨幅', dataIndex: 'rise', width: 80,
      }, {
        title: '现价', dataIndex: 'prise', width: 80,
      }, {
        title: '涨跌', dataIndex: 'orderChange',  width: 80,
      }, {
        title: '成交量', dataIndex: 'volume',  width: 80,
      }, {
        title: '市盈率', dataIndex: 'PEratio',  width: 80,
      }, {
        title: '振幅', dataIndex: 'amplitude', width: 80,
      }, {
        title: '委差', dataIndex: 'disparity', width: 80,
      }, {
        title: '委比', dataIndex: 'vabi', width: 80,
      }, {
        title: '内盘', dataIndex: 'inPlate', width: 80,
      }, {
        title: '外盘', dataIndex: 'outPlate',width: 80,
      }, {
        title: '换手', dataIndex: 'changeHand', width: 80,
      }, {
        title: '涨速', dataIndex: 'inSpeed',  width: 80,
      }, {
        title: '成交额', dataIndex: 'turnover', width: 80,
      }, {
        title: '今开', dataIndex: 'todayOpen', width: 80,
      }, {
        title: '最高', dataIndex: 'highest', width: 80,
      }, {
        title: '最低', dataIndex: 'lowest',  width: 80,
      }, {
        title: '昨收', dataIndex: 'yesClose', width: 80,
      }, {
        title: '净资', dataIndex: 'netcapital',  width: 80,
      }, {
        title: '总股本', dataIndex: 'totalCapital',  width: 80,
      }, {
        title: '流通股', dataIndex: 'circulating',  width: 80,
      }
    ]
  },
    boardTable: {
        compType: 'table',
        compName: 'boardTable', // 组件名
        tabTitle: ['全部板块', '行业板块', '概念板块', '风格板块', '地区板块', '沪深统计', '板块地图','主题投资'], // tabs中文名
        actionName: ['all', 'industry', 'concept', 'style', 'area', 'count', 'stock','theme'], // tabs英文名
        dataType: [], // 数据类型
        size: 'small', // 组件大小
        pagination: false, // 是否分页
        columns: [{ // 表格列配置
            title: '序号', dataIndex: 'order',isSorter:false, width: 50,
        }, {
            title: '代码', dataIndex: 'code',  width: 80,
        }, {
            title: '名称', dataIndex: 'name',  width: 80,
        }, {
            title: '涨幅', dataIndex: 'rise', width: 80,
        }, {
            title: '现价', dataIndex: 'prise',  width: 80,
        }, {
            title: '涨跌', dataIndex: 'orderChange',  width: 80,
        }, {
            title: '成交量', dataIndex: 'volume', width: 80,
        }, {
            title: '市盈率', dataIndex: 'PEratio',  width: 80,
        }, {
            title: '振幅', dataIndex: 'amplitude',  width: 80,
        }, {
            title: '委差', dataIndex: 'disparity',  width: 80,
        }, {
            title: '委比', dataIndex: 'vabi', width: 80,
        }, {
            title: '内盘', dataIndex: 'inPlate',  width: 80,
        }, {
            title: '外盘', dataIndex: 'outPlate',  width: 80,
        }, {
            title: '换手', dataIndex: 'changeHand', width: 80,
        }, {
            title: '涨速', dataIndex: 'inSpeed',  width: 80,
        }, {
            title: '成交额', dataIndex: 'turnover', width: 80,
        }, {
            title: '今开', dataIndex: 'todayOpen', width: 80,
        }, {
            title: '最高', dataIndex: 'highest', width: 80,
        }, {
            title: '最低', dataIndex: 'lowest',  width: 80,
        }, {
            title: '昨收', dataIndex: 'yesClose',  width: 80,
        }, {
            title: '净资', dataIndex: 'netcapital',  width: 80,
        }, {
            title: '总股本', dataIndex: 'totalCapital',  width: 80,
        }, {
            title: '流通股', dataIndex: 'circulating', width: 80,
        }
        ]
    },
    singleTable:{
        compType: 'table',
        compName: 'singleTable', // 组件名
        tabTitle: '', // tabs中文名
        actionName: 'all', // tabs英文名
        dataType: [], // 数据类型
        size: 'small', // 组件大小
        pagination: false, // 是否分页
        columns: [{ // 表格列配置
            title: '序号', dataIndex: 'order', isSorter:false, width: 50,
        }, {
            title: '代码', dataIndex: 'code',  width: 80,
        }, {
            title: '名称', dataIndex: 'name', width: 80,
        }, {
            title: '涨幅', dataIndex: 'rise', width: 80,
        }, {
            title: '现价', dataIndex: 'prise',  width: 80,
        }, {
            title: '涨跌', dataIndex: 'orderChange',  width: 80,
        }, {
            title: '成交量', dataIndex: 'volume',  width: 80,
        }, {
            title: '市盈率', dataIndex: 'PEratio',  width: 80,
        }, {
            title: '振幅', dataIndex: 'amplitude', width: 80,
        }, {
            title: '委差', dataIndex: 'disparity', width: 80,
        }, {
            title: '委比', dataIndex: 'vabi',  width: 80,
        }, {
            title: '内盘', dataIndex: 'inPlate', width: 80,
        }, {
            title: '外盘', dataIndex: 'outPlate', width: 80,
        }, {
            title: '换手', dataIndex: 'changeHand',  width: 80,
        }, {
            title: '涨速', dataIndex: 'inSpeed',  width: 80,
        }, {
            title: '成交额', dataIndex: 'turnover',  width: 80,
        }, {
            title: '今开', dataIndex: 'todayOpen',  width: 80,
        }, {
            title: '最高', dataIndex: 'highest',  width: 80,
        }, {
            title: '最低', dataIndex: 'lowest',width: 80,
        }, {
            title: '昨收', dataIndex: 'yesClose', width: 80,
        }, {
            title: '净资', dataIndex: 'netcapital', width: 80,
        }, {
            title: '总股本', dataIndex: 'totalCapital', width: 80,
        }, {
            title: '流通股', dataIndex: 'circulating', width: 80,
        }
        ]
    }
}

Object.keys(config).forEach(key => {
  if(config[key].compType === 'table'){
    config[key].columns.map(item => {
      if(['order', 'name'].indexOf(item.dataIndex) ===  -1){
        item.sorter = (a, b) => a[item.dataIndex] - b[item.dataIndex];
        item.width += 20;
      }
    })
  }
})

export default config;

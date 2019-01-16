
/**
 * tab切换
 */

let baseConfig ={
  quotationListTable: {
    compType: 'table',
    compName: 'quotationTable', // 组件名
    tabTitle: ['全部', '沪深', '港股', '债券', '基金', '期货', '期权'], // tabs中文名
    actionName: ['all', 'industry', 'concept', 'style', 'area', 'count', 'stock'], // tabs英文名
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
        title: '涨幅', dataIndex: 'rise',  width: 80,
      }, {
        title: '现价', dataIndex: 'prise', width: 80,
      }, {
        title: '涨跌', dataIndex: 'orderChange', width: 80,
      }, {
        title: '成交量', dataIndex: 'volume', width: 80,
      }, {
        title: '市盈率', dataIndex: 'PEratio', width: 80,
      }, {
        title: '振幅', dataIndex: 'amplitude', width: 80,
      }, {
        title: '委差', dataIndex: 'disparity', width: 80,
      }, {
        title: '委比', dataIndex: 'vabi',  width: 80,
      }, {
        title: '内盘', dataIndex: 'inPlate', width: 80,
      }, {
        title: '外盘', dataIndex: 'outPlate',width: 80,
      }, {
        title: '换手', dataIndex: 'changeHand', width: 80,
      }, {
        title: '涨速', dataIndex: 'inSpeed', width: 80,
      }, {
        title: '成交额', dataIndex: 'turnover',  width: 80,
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
        title: '流通股', dataIndex: 'circulating', width: 80,
      }
    ]
  },
  baseNews: {
    compName: 'news', // 组件名
    compType: 'news',
    dataType: ['time', 'title'], // 数据类型
  },
}
Object.keys(baseConfig).forEach(key => {
  if(baseConfig[key].compType === 'table'){
    baseConfig[key].columns.map(item => {
      if(['order', 'name'].indexOf(item.dataIndex) ===  -1){
        item.sorter = (a, b) => a[item.dataIndex] - b[item.dataIndex];
        item.width += 20;
      }
    })
  }
})

export default baseConfig;
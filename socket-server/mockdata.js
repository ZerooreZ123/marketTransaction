const Mock = require('mockjs');
const Random = Mock.Random;

function MockHandler() {

  let data = {};
  let config = {
    names: [
      {code: '601766', name: '中国中车'},
      {code: '601989', name: '中国重工'},
      {code: '002024', name: '苏宁易购'},
      {code: '601985', name: '中国核电'},
      {code: '000002', name: '万 科Ａ'},
      {code: '601390', name: '中国中铁'},
      {code: '000725', name: '京东方Ａ'},
      {code: '600868', name: '梅雁吉祥'},
      {code: '000651', name: '格力电器'},
      {code: '601688', name: '中国建筑'},
      {code: '600050', name: '中国联通'},
      {code: '601857', name: '中国石油'},
      {code: '300104', name: '乐视网'},
      {code: '601899', name: '紫金矿业'},
      {code: '601186', name: '中国铁建'},
      {code: '601988', name: '中国银行'},
      {code: '600028', name: '中国石化'},
      {code: '601318', name: '中国平安'},
    ]
  }

  this.generateTableData = function(name) {
    // 生成表格数据
    if(!data[name])data[name] = [];
    if(data[name].length === 0){
      for(let i=0; i < config.names.length; i++){
        let tmpData = {
          order: i + 1, // 序号
          code: config.names[i].code, // 代码
          name: config.names[i].name, // 名称
          rise: Random.float( -10, 10, 0, 2 ), // 涨幅
          prise: Random.integer( 20, 300 ), // 现价
          orderChange: Random.integer( 1, 10 ), // 涨跌
          totalAmount: Random.integer( 5000, 10000 ), // 总量
          nowAmount: Random.integer( 5, 50 ), // 现量
          PEratio: Random.integer( 5, 10 ), // 市盈率
          amplitude: Random.integer( 5, 10 ), // 振幅
          disparity: Random.integer( 5, 10 ), // 委差
          vabi: Random.integer( 5, 10 ), // 委比
          inPlate: Random.integer( 5, 10 ), // 内盘
          outPlate: Random.integer( 5, 10 ), // 内盘
        }
        tmpData.volume = Random.integer( 5, tmpData.totalAmount / 2 ), // 成交量
        tmpData.buyPrice = tmpData.prise + Random.integer( -8, 8 );
        tmpData.sellPrice = tmpData.prise + Random.integer( -8, 8 );
        tmpData.changeHand = parseInt(tmpData.volume * 0.2); // 换手
        tmpData.inSpeed = parseInt(tmpData.rise * 1.2); // 涨速
        tmpData.turnover = tmpData.volume * tmpData.prise; // 成交额
        tmpData.todayOpen = parseInt(tmpData.prise / tmpData.rise); // 今开
        tmpData.highest = tmpData.prise + 5; // 最高
        tmpData.lowest = tmpData.prise - 5; // 最低
        tmpData.yesClose = tmpData.prise + Random.integer( -8, 8 ); // 昨收
        tmpData.netcapital = parseInt(tmpData.prise * tmpData.volume * 0.4); // 净资
        tmpData.totalCapital = tmpData.prise * tmpData.volume; // 总股本
        tmpData.circulating = parseInt(tmpData.totalCapital * 0.4); // 流通股
        data[name].push(tmpData);
      }
    }else{
      data[name].map(tmpData => {
        let nowRise = Random.float( tmpData.rise - 2, tmpData.rise + 2, 0, 2 );
        if(nowRise < tmpData.Rise){
          tmpData.prise = Random.integer( tmpData.prise - 1, tmpData.prise );
        }else{
          tmpData.prise = Random.integer( tmpData.prise, tmpData.prise + 1 );
        }
        tmpData.nowAmount = Random.integer( 5, 50 ), // 现量
        tmpData.volume = Random.integer( 5, tmpData.totalAmount / 2 ), // 成交量
        tmpData.buyPrice = tmpData.prise + Random.integer( -8, 8 );
        tmpData.sellPrice = tmpData.prise + Random.integer( -8, 8 );
        tmpData.orderChange = Random.integer( 1, 10 );
        tmpData.rise = nowRise;
        tmpData.changeHand = parseInt(tmpData.volume * 0.2); // 换手
        tmpData.inSpeed = parseInt(tmpData.rise * 1.2); // 涨速
        tmpData.turnover = tmpData.volumn * tmpData.prise; // 成交额
        tmpData.todayOpen = parseInt(tmpData.prise / tmpData.rise); // 今开
        tmpData.highest = tmpData.prise + 5; // 最高
        tmpData.lowest = tmpData.prise - 5; // 最低
        tmpData.yesClose = tmpData.prise + Random.integer( -8, 8 ); // 昨收
        tmpData.netcapital = parseInt(tmpData.prise * tmpData.volume * 0.4); // 净资
        tmpData.totalCapital= tmpData.prise * tmpData.volume; // 总股本
        tmpData.circulating= parseInt(tmpData.totalCapital * 0.4); // 流通股
      })
    }
  }

  this.generateZDData = function(type) {
    if(data['all']){
      debugger;
      let ZDFData = data['all'];
      let newData;
      if(type === 'ZDF'){
        newData = ZDFData.sort((a, b) => a.prise - b.prise);
      }else if(type === 'ZDS'){
        newData = ZDFData.sort((a, b) => a.inSpeed - b.inSpeed);
      }
      return [...newData.slice(0, 8), ...newData.reverse().slice(0, 8)];
    }
  }

  this.generateNewsData = function(name) {
    if(!data[name])data[name] = [];
    let now = Date.now();
    if(data[name].length === 0){
      for(let i=0; i < 10; i++){
        let tmp = new Date(now - i * 136200);
        let minute = tmp.getMinutes();
        if(minute < 10)minute = '0' + minute;
        data[name].push({
          time: `${tmp.getHours()}:${minute}`,
          title: Random.ctitle( 5, 16 )
        })
      }
    }else{
      let tmp = new Date(now - Random.integer( 1000, 10000 ));
      let minute = tmp.getMinutes();
      if(minute < 10)minute = '0' + minute;
      data[name] = [];
      data[name].push({
        time: `${tmp.getHours()}:${minute}`,
        title: Random.ctitle( 5, 16 )
      })
    }
  }

  this.getData = ({type}) => {
    // 获取数据
    switch(type){
      case 'six':
      case 'all':
      case 'industry':
      case 'concept':
      case 'style':
      case 'area':
      case 'count':
        case 'stock':
        case 'theme':
        this.generateTableData(type);
        break;
      case 'ZDF':
      case 'ZDS':
        return this.generateZDData(type);
      case 'quickNews':
      case 'financialNews':
        this.generateNewsData(type);
        break;
    }
    return data[type];
  }
}

module.exports = MockHandler;

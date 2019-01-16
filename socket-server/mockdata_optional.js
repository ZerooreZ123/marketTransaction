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
        data[name].push({
          order: i + 1,
          code: config.names[i].code,
          name: config.names[i].name,
          rise: Random.float( -10, 10, 0, 2 ),
          prise: Random.integer( 5, 30 ),
          orderChange: Random.integer( 1, 10 )
        })
      }
    }else{
      data[name].map(item => {
        let nowRise = Random.float( item.rise - 2, item.rise + 2, 0, 2 );
        if(nowRise < item.Rise){
          item.prise = Random.integer( item.prise - 1, item.prise );
        }else{
          item.prise = Random.integer( item.prise, item.prise + 1 );
        }
        item.orderChange = Random.integer( 1, 10 );
        item.rise = nowRise;
      })
    }
  }

  this.getData = ({type}) => {
    // 获取数据
    switch(type){
      case 'optional':
        this.generateTableData(type);
        console.log(type);
        console.log(data[type]);
        return data[type];
      case 'order':
        return orderData;
    }
  }
}

module.exports = MockHandler;

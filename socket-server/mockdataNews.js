const Mock = require('mockjs');
const Random = Mock.Random;

function MockHandlerNews() {

  let data = {};

    let configNews = {
        names: [
            { text: '新天然气:拟要约收购港殷公司亚美能源50.5%股份'},
            { text: '广东出台规划支持农产品加工业,力争到2020年总产值达到1.65万亿元'},
            { text: '中国中铁:公司中标多个重大工程,中标价合计约人民币120.53亿元,约占本公司中国会计准则下2017年营业收入的1.75%'},
            { text: '传闻大驵将融资10亿美元?官方回应:从未对外公布融广信股份:合计持股3.52%股东安创投、兴皖创投、国安创投计划6个月内减持不超过2%康盛股份:'},
            { text: '拟重组置入中植汽车旗下资产夜盘开盘,原油领涨海南!'},
            { text: '自2018年5月16日0时起在全实行小客车忌调控理嘉椭耘智向港交所递交招股书,或成香港第一家区块链'},

        ]
    }

  this.generateTableData=function (name) {
      // 生成表格数据
      if(!data[name])data[name] = [];
      if(data[name].length === 0){
          for(let i=0; i < configNews.names.length; i++){
              data[name].push({
                  order: i + 1,
                  time: Random.integer( 1, 10 ),
                  text: configNews.names[i].text,
              })
          }
      }else{
          data[name].map(item => {
              // let nowRise = Random.float( item.rise - 2, item.rise + 2, 0, 2 );
              item.time= Random.integer( 0, 24 )
              item.text= configNews.names[(Random.integer( 0, 5 ))].text
          })
      }
  }

  this.getData = ({type}) => {
    // 获取数据
    switch(type){
        case 'nine':
        case 'live':
        case 'financial':
          this.generateTableData(type)
            return data[type]
    }
  }
}

module.exports = MockHandlerNews;

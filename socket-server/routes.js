const Mock = require('mockjs');
const Random = Mock.Random;
const urls = [
  {
    url: 'https://www.imooc.com/user/newforgot',
    title: '慕课网注册'
  }, {
    url: 'http://gogs.xinyusoft.com/user/login?redirect_to=',
    title: 'gogs登录',
  }, {
    url: 'https://www.imooc.com/user/newlogin/from_url/',
    title: '慕课网登录'
  }, {
    url: 'https://api.weibo.com/oauth2/authorize?client_id=2788596354&response_type=code&scope=follow_app_official_microblog&forcelogin=false&redirect_uri=http%3A%2F%2Fpassport.mukewang.com%2Fuser%2Ftpcallback%3Freferer%3Dhttps%3A%2F%2Fwww.imooc.com%26browser_key%3D2033e286b123a16f3eef2170e2c014d2%26tp%3Dweibo%26bind%3D0',
    title: '微博登录'
  }, {
    url: 'http://acm.zju.edu.cn/onlinejudge/login.do',
    title: '浙大oj登录'
  }, {
    url: 'https://m.weibo.cn/reg/index?jp=1&wm=4406&appsrc=4uA4iS&backURL=https%3A%2F%2Fapi.weibo.com%2F2%2Foauth2%2Fauthorize%3Fclient_id%3D2788596354%26response_type%3Dcode%26display%3Dmobile%26redirect_uri%3Dhttp%253A%252F%252Fpassport.mukewang.com%252Fuser%252Ftpcallback%253Freferer%253Dhttps%253A%252F%252Fwww.imooc.com%2526amp%253Bbrowser_key%253D2033e286b123a16f3eef2170e2c014d2%2526amp%253Btp%253Dweibo%2526amp%253Bbind%253D0%26from%3D%26with_cookie%3D',
    title: '微博注册'
  }, {
    url: 'http://bestcoder.hdu.edu.cn/login.php',
    title: '杭电oj登录'
  }, {
    url: 'https://passport.cnblogs.com/user/signin',
    title: '博客园登录'
  }, {
    url: 'https://exmail.qq.com/cgi-bin/loginpage',
    title: '微信企业邮箱登录'
  }, {
    url: 'http://ym.163.com/',
    title: '网易企业邮箱登录'
  }, {
    url: 'https://www.zhihu.com/org/signup',
    title: '知乎注册'
  }, {
    url: 'https://www.hackerrank.com/auth/forgot_password',
    title: 'HackerRank忘记密码'
  }
]

let resdata = [{
  type: 'website',
  screen: [4, 2],
  config: [[2, 1], [1, 1], [1, 2], [1, 1], [1, 1], [1, 1]],
},{
  type: 'website',
  screen: [4, 2],
  config: [[1, 1], [1, 2], [1, 1], [1, 1], [1, 1], [2, 1]],
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 2], [2, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [2, 1], [1, 1]]
},{
  type: 'website',
  screen: [5, 3],
  config: [[3, 1], [1, 1], [1, 1], [2, 1], [1, 1], [2, 2], [1, 1], [1, 1], [1, 1]]
},{
  type: 'website',
  screen: [2, 3],
  config: [[2, 2], [1, 1], [1, 1]]
},{
  type: 'website',
  screen: [5, 3],
  config: [[2, 1], [1, 1], [2, 2], [1, 2], [2, 1], [3, 1], [1, 1], [1, 1]]
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 2], [2, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [2, 1], [1, 1]]
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 1], [1, 1], [2, 1], [1, 2], [1, 1], [2, 2], [1, 1]]
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 2], [2, 1], [1, 1], [1, 1], [2, 2], [1, 1], [1, 1]]
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 2], [2, 1], [2, 2], [2, 1], [2, 2], [1, 2]]
},{
  type: 'website',
  screen: [4, 3],
  config: [[1, 2], [1, 1], [1, 1], [2, 1], [1, 1], [1, 1], [2, 2], [1, 1], [1, 1], [1, 2], [1, 1]]
}];

resdata.map(item => {
  item.data = [];
  item.config.map((data, index) => {
    let tmp = {};
    [tmp.xn, tmp.yn] = data;
    tmp.url = urls[index].url;
    tmp.title = urls[index].title;
    item.data.push(tmp);
  })
  delete item.config;
})

let plugins = [{
  type: 'common',
  name: '通用',
  plugins: [
    {icon: 'pay-circle', compName: 'BaseChart', cn: '迷你报价', config: '', },
    {icon: 'star', compName: 'CompTable', cn: '自选股'},
    {icon: 'line-chart', compName: 'CompChart', cn: '短线精灵'},
    {icon: 'flag', compName: 'BaseChart', cn: '选股'},
    {icon: 'clock-circle', compName: 'BaseChart', cn: '时钟'},
  ]
}, {
  type: 'Astock',
  name: 'A股',
  plugins: [
    {icon: 'pay-circle', compName: 'BaseChart', cn: '迷你报价'},
    {icon: 'dot-chart', compName: 'BaseChart', cn: '交易'},
    {icon: 'cloud', compName: '', cn: '账户'},
    {icon: 'star', compName: '', cn: '持仓'},
    {icon: 'pie-chart', compName: '', cn: '订单'},
    {icon: 'profile', compName: '', cn: '交易历史'},
    {icon: 'api', compName: '', cn: '今日统计'},
  ]
}, {
  type: 'HKstock',
  name: '港股',
  plugins: [
    {icon: 'pay-circle', compName: '', cn: '迷你报价'},
    {icon: 'dot-chart', compName: '', cn: '交易'},
    {icon: 'cloud', compName: '', cn: '账户'},
    {icon: 'star', compName: '', cn: '持仓'},
    {icon: 'pie-chart', compName: '', cn: '订单'},
    {icon: 'profile', compName: '', cn: '交易历史'},
    {icon: 'api', compName: '', cn: '今日统计'},
    {icon: 'copyright', compName: '', cn: '条件单'},
    {icon: 'global', compName: '', cn: '经纪监察'},
  ]
}]

let stocks = [
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

module.exports = function(app){
  app.get('/customize', (req, res) => {
    console.log('/customize');
    //return res.json({data: resdata[Random.integer( 0, resdata.length - 1 )]});
    return res.json({data: resdata[3]});
  });

  app.get('/customize_all', (req, res) => {
    console.log('/customize_all');
    return res.json({data: resdata[resdata.length - 1]});
  });

  app.get('/plugins', (req, res) => {
    console.log('/plugins');
    return res.json(plugins);
  });

  app.get('/f10-industry', (req, res) => {
    console.log('/f10-industry');
    var allKey = [
      'change', 'change1Week', 'change1Month', 'change3Month', 'change6Month',
      'change1Year', 'a_total', 'a_circulation', 'circulation_a', 'total',
      'business', 'PETTM', 'PELYR', 'PEMRQ', 'PSTTM', 'PNTTM', 'nowPrise',
      'one_income', 'one_assets', 'assets_income', 'sale_profit', 'profit_rate'
    ];
    var data = {
      stock: [],
      maxData: {},
      news: []
    }
    allKey.forEach(key => data.maxData[key] = 0);
    stocks.forEach((stock, index) => {
      var tmpStock = {
        rank: index,
        code: stock.code,
        alias: stock.name,
        change: Random.float( -10, 10, 0, 2 ),
        a_total: Random.float( 500, 2000, 0, 2 ),
        PETTM: Random.float( -600, 600, 0, 2 ),
        nowPrise: Random.float( 8, 125, 0, 2 ),
        one_income: Random.float( -1, 8, 0, 2 ),
        one_assets: Random.float( 2, 8, 0, 2 ),
      };
      ['change1Week', 'change1Month', 'change3Month', 'change6Month', 'change1Year'].forEach(key => {
        tmpStock[key] = parseInt(tmpStock['change'] + Random.float( -1, 1, 0, 2 ) * 100) / 100;
      });
      tmpStock['a_circulation'] = parseInt(tmpStock['a_total'] * 0.8 * 100) / 100;
      tmpStock['total'] = parseInt(tmpStock['a_total'] * 36);
      tmpStock['circulation_a'] = parseInt(tmpStock['total'] * 0.8);
      tmpStock['business'] = parseInt(tmpStock['a_total'] * 1024);
      tmpStock['PELYR'] = parseInt(tmpStock['PETTM'] / 2.5 * 100) / 100;
      tmpStock['PEMRQ'] = parseInt(tmpStock['PETTM'] / 10 * 100) / 100;
      tmpStock['PSTTM'] = parseInt(tmpStock['PELYR'] * 100) / 100;
      tmpStock['PNTTM'] = parseInt(tmpStock['PELYR'] * 100) / 100;
      tmpStock['assets_income'] = parseInt(tmpStock['one_income'] * 5 * 100) / 100;
      tmpStock['sale_profit'] = parseInt(tmpStock['assets_income'] * 5 * 100 * 100) / 100;
      tmpStock['profit_rate'] = parseInt(Random.float( 0, 4, 0, 2 ) * 100 * 100) / 100;
      allKey.forEach(key => {
        if(Math.abs(tmpStock[key]) > data.maxData[key]) data.maxData[key] = Math.abs(tmpStock[key]);
      });
      data.stock.push(tmpStock);
    })
    var now = Date.now();
    for(var i=0; i < 15; i++){
      var tmp = new Date(now - i * 236200000);
      var month = tmp.getMonth();
      var daten = tmp.getDate();
      if(month + 1 < 10)month = '0' + (month + 1);
      if(daten < 10)daten = '0' + daten;
      data.news.push({
        date: `${tmp.getFullYear()}-${month}-${daten}`,
        title: Random.ctitle( 10, 26 )
      });
    }
    return res.json(data);
  });
}

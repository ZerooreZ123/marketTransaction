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

export const resData = resdata;

export const plugins = [{
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

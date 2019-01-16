var MockHandler = require('./mockdata.js');
var Mockdata_optional = require('./mockdata_optional.js');
var MockHandlerNews = require('./mockdataNews.js');
var app = require('express')();
var server = require('http').Server(app);
//const jsonParser = require('socket.io-json-parser');
var io = require('socket.io')(server);//, {parser: jsonParser});

var mockHandler = new MockHandler();
var Mockdata_optional = new Mockdata_optional();
var mockHandlerNews = new MockHandlerNews();

var cache = {
  nameList: {},
  nameListActive: new Set([]),
  msgList: []
};

var sessionFresh = setInterval(() => {
  for (var key in cache.nameList) {
    cache.nameList[key] -= 10000;
    if (cache.nameList[key] <= 0) {
      delete cache.nameList[key];
    }
  }
}, 10000);

io.on('connection', (socket) => {

  console.log('connection');
  let emitFlag = { };

  socket.on('authority', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    Object.keys(emitFlag).forEach(item => {
      clearInterval(emitFlag[item]);
      emitFlag[item] = null;
    })
    console.log('disconnect');
  });

  socket.on('getData', (data) => {
    /* ************
     * 获取数据
     * data:
     *   type: ...['table', 'order']
     * ***********/
    let emitHandler = (data) => {
      console.log(data)
      switch(data.type){
          case 'seven':
          case 'self' :
          case 'options' :
          case 'hkStock' :
        case 'six':
        case 'all':
        case 'industry':
        case 'concept':
        case 'style':
        case 'area':
        case 'count':
          case 'stock':
          case 'theme':
        case 'optionTable':
        case 'ZDF':
        case 'ZDS':
        case 'news':
        case 'quickNews':
        case 'financialNews':
          socket.emit('resData', {type: data.type, data: mockHandler.getData(data)});
          break;
        case 'optional':
          socket.emit('resData', {type: data.type, data: Mockdata_optional.getData(data)});
          break;
        case 'nine':
        case 'live':
        case 'financial':
            socket.emit('resData', {type: data.type, data: mockHandlerNews.getData(data)});
            break;
      }
    }
    if(emitFlag[data.type] == null){
      emitFlag[data.type] = setInterval(() => {
        emitHandler(data);
      }, 5000);
      emitHandler(data);
    }
  });

  socket.on('disMonitor', data => {
    /* ************
     * 取消推送
     * data:
     *   type: ...['table', 'order']
     * ***********/
    if(emitFlag[data.type] != null){
      clearInterval(emitFlag[data.type]);
      emitFlag[data.type] = null;
    }
  })

  socket.on('heart beat', () => {
    // 心脏检测
    console.log('heart beat');
    if (socket.nickname != undefined) {
      cache.nameList[socket.nickname] = 7200000;
    }
  });
});

server.listen(process.env.PORT || 5000, function() {
  console.log('listening port 5000');
});

server.on('error', err => {
  console.log('error --> ', err.message);
  process.exit(1);
});

var routes = require('./routes');
routes(app);

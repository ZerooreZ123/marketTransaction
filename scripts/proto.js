'use strict';
const exec = require('child_process').exec;
const paths = require('../config/paths');

const cli = `pbjs -t json ${paths.appSrc}/utils/proto/*.proto > ${paths.appSrc}/utils/proto.json`;
function transProto(){
  exec(cli, {encoding: 'utf8'}, function (err, stdout, stderr){
    if (err){
      console.log(err);
      return;
    }
    if(stderr && stderr !== ''){
      console.log(stderr);
      console.log('安装依赖成功, 重新执行转换函数');
      transProto();
      return;
    }
    if(stdout === ''){
      console.log('proto转换成功');
    }else{
      console.log('非报错, 但返回信息不符合预期', stdout);
    }
  })
}

if(process.argv[2] === '--exec'){
  transProto();
}

module.exports = transProto;

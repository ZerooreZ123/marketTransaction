// const io = require('socket.io-client');
//const parser = require('socket.io-json-parser');

//const host = 'http://localhost:3000';
//const socketPath = '/api/socket.io';
//const host = 'http://58.247.47.154:1082';
//const socketPath = '';
import config from '@/config';
import io from 'socket.io-client';
import {ProtoManager} from '@/utils/BaseTools';
import moment from 'moment';
import { monitor, add, glbj, pregendataby7all } from '@/actions/data';
const host = config.SOCKET_HOST;
const protoManager = new ProtoManager();
const inThePlate = [true, false, true, false];

export default class SocketAPI {

  /* *****************
   * desc: 对socket方法封装
   * props:
   *   socket|Obj: 实例化的socket对象, 为null表示断开或未连接
   *   isAuth|Bool: 标识此次连接是否已认证
   *   connect|Fun(): 实例化socket对象并连接到服务器
   *   auth|Fun(): 连接socket服务器后的认证
   *   disconnect|Fun(): 将socket对象设为null, 模拟断开操作
   *   emit|Fun(event, data): 发起事件与服务器交互
   *   on|Fun(event, fun): 监听事件
   * ****************/

  socket = null;
  isAuth = false;
  time = null;

  connect() {
    /* *****************
     * params: none
     * return: Promise
     * desc: 连接socket服务器, 成功则返回this指针, 失败则返回错误信息及定时器
     * ****************/

    if(this.socket){
      this.socket.close && this.socket.close()
      this.socket = null;
    }
    this.socket = io(host,{
      'force new connection' : true,
      'transports':['websocket','polling']
    });//, {parser: parser});
    return new Promise((resolve, reject) => {
      this.time = (new Date()).getTime();
      let self = this;
      this.socket.on('connect', () => {
        console.log(`socket: socket 已经连接, 发起连接请求到连接成功用时 ${((new Date()).getTime() - this.time) / 1000} 秒`);
        // 订阅开盘及收盘信号
        self.emit('sub', {subs: [{symbol: 'SIGNAL', dataType: 0}]});
        // 重连后重新发起订阅
        Object.values(window.superMonitor).forEach(item => {item.isSubscription && window.socket.emit('sub', {subs: item.command})});
        self.socket.on('msg', (dataType, symbol, arrayFlag, buffer, order, count, startNum) => {
          //if(symbol === 'SIGNAL')debugger;
          let args = { count, order, startNum };
          let actionName = `${symbol}-${dataType}`;
          if(window.superMonitor[actionName]){
            window.superMonitor[actionName].meetNum ++;
            //window.superMonitor[actionName].meetTime.push(moment().format('YYYY-MM-DD HH:mm:ss'));
            window.superMonitor[actionName].lastMeetTime = moment().format('YYYY-MM-DD HH:mm:ss');
          }else{
            console.log('weberror: 接收未知推送, dataType: ', dataType, ', symbol', symbol, ', buffer', buffer);
          }
          if(buffer === null)return;
          if(false && window.superMonitor[actionName].lastSaveTime)return;
          let newData;
          try{
            newData = protoManager.decodeData(buffer, dataType, arrayFlag, symbol);
          }catch(err){
            console.log('message: ', err.message, ', dataType: ', err.dataType, ', arrayFlag: ', err.arrayFlag, ', data: ', buffer, ', 堆栈信息: ', err.stack);
          }
          if(newData){
            if(dataType === 0){
              console.log('开盘信号: ', newData);
              let isInThePlate = inThePlate[newData.type] === undefined? true: inThePlate[newData.type];
              if(!window.superMonitor.isInThePlate && isInThePlate && symbol === 'SIGNAL_NEW'){
                // 收到开盘及复盘信号且页面非初始状态则重新订阅所有数据
                if(newData.type === 0){
                  // 将dataType为7的数据初始化
                  window.store.dispatch({type: String(pregendataby7all)});
                }
                Object.values(window.superMonitor).forEach(item => {item.isSubscription && window.socket.emit('sub', {subs: item.command})});
              }
              window.superMonitor.isInThePlate = isInThePlate;
              //if(!window.superMonitor.isInThePlate){
              //  [...document.querySelectorAll('.aniupper'), ...document.querySelectorAll('.aniunder')].forEach(ele => ele.classList.remove('aniupper', 'aniunder'))
              //}
            } else if(dataType === 6){
              let optionIndex = window.selfOptions.findIndex(item => item.uuid === newData.uuid);
              let glbjIndex = window.glbjList.findIndex(item => item.uuid === newData.uuid);
              if(optionIndex > -1 ){
                window.store.dispatch({type: String(add), payload: {type: 'option-ALL', data: newData, ...args}});
              }
              if(glbjIndex > -1){
                window.store.dispatch({type: String(glbj), payload: {type: 'glbj-ALL', data: newData, ...args}});
              }
              window.store.dispatch({type: String(monitor), payload: {type: actionName, data: newData, ...args}});
            }else{
              if(order !== undefined)newData.order = order;
              window.store.dispatch({type: String(monitor), payload: {type: actionName, data: newData, ...args}});
            }
          }
        })
        return resolve(this);
      });
      this.socket.on('connect_error', (error) => {
        //setTimeout(this.connect(), 3000);
        console.log("socket: 连接错误", error);
        this.connect();
      });
      this.socket.on('disconnect', data => {
        console.log('socket: 断开连接', data);
        this.connect();
        //socket.socket = null;
      })
    });
  }

  auth() {
    /* *****************
     * params: none
     * return: none
     * desc: 连接后的认证
     * ****************/
    this.on('authority', data => {
      if(data){
        this.isAuth = true;
        console.log('认证成功!');
      }
    }).then(_ => {
      this.emit("authority", {
        courseid: '631',
        userid: '1845',
        flag: 1
      });
    })
  }

  disconnect() {
    /* *****************
     * params: none
     * return: Promise
     * desc: 断开连接
     * ****************/
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        console.log('手动: 断开连接');
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event, data) {
    /* *****************
     * params:
     *   event: 事件名称
     *   data: 携带的数据
     * return: Promise
     * desc: 用于与socket服务器交互
     * ****************/
    return new Promise((resolve, reject) => {
      if (!this.socket){
        console.log('socket被未知操作设置为null');
        this.connect().then(() => {
          return this.socket.emit(event, data, (response) => {
            return resolve();
          });
        });
      }
      return this.socket.emit(event, data, (response) => {
        return resolve();
      });
    });
  }

  on(event, fun) {
    /* *****************
     * params:
     *   event: 事件名称
     *   fun: 回调函数
     * return: Promise
     * desc: 监听事件
     * ****************/
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('socket未连接');

      this.socket.on(event, fun);
      resolve();
    });
  }
}

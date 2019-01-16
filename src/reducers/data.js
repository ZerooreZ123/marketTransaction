import { handleActions } from 'redux-actions';
import { monitor, init, add, del, option_sort, pregendataby7, glbj, dataupdate, pregendataby7all} from '@/actions';
import { ProtoManager } from '@/utils/BaseTools';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { Modal } from 'antd';
import _isEqual from 'lodash/isEqual';
const uuid = require('uuid/v1');
// 隔夜更新码表提示框
let isShowTipMadol = false;

// 分时样本数据, 应用于dataType7
const sampleDataKeys7 = ['date', 'time', 'price', 'nowVolume', 'avgPrice', 'netChangeRatio', 'preClose',
  'nowAmount', 'volume', 'amount', 'netChange', 'bprice', 'turnoverRatio'];

let reEmitOne = null;
const reEmitTime = 30;


const Data = handleActions({
  [dataupdate]: (state, { payload }) => {
    const {data, type} = payload;
    state[type] = data;
    return state;
  },

  [monitor]: (state, { payload }) => {
    let indexAt, updateData;
    let [symbol, dataType] = payload.type.split('-');
    let targetObj = window.superMonitor[payload.type];
    if (dataType === '7' && !targetObj.preData) {
      // 开盘后分时数据推送来了, 应替换掉历史数据
      try{
        [updateData, indexAt] = (0, ProtoManager.handleData)(payload.type, _cloneDeep(state.pregendataby7), payload.data);
      }catch(err){
        debugger;
      }
    } else {
      try{
        [updateData, indexAt] = (0, ProtoManager.handleData)(payload.type, _cloneDeep(state[payload.type]), payload.data);
      }catch(err){
        debugger;
      }
    }
    if (!updateData) return state;
    if (payload.count !== undefined) {
      updateData = { data: updateData, startNum: payload.startNum, count: payload.count, duuid: uuid() };
    }

    /* 监控参数变化与异常处理 start */
    overnight();
    targetObj.saveNum++;
    targetObj.lastSaveTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (targetObj.monitorSub !== undefined) {
      // 清除定时器
      clearInterval(targetObj.monitorSub);
      targetObj.monitorSub = undefined;
    }
    //if(window.superMonitor.isInThePlate === undefined && dataType === '7'){
    // 判断是否盘中
    //  window.superMonitor.isInThePlate = inThePlate(updateData);
    //  if(!window.superMonitor.isInThePlate)console.log('webinfo: 当前时间非盘中');
    //}
    if(indexAt === 241 || targetObj.indexAt === 0)targetObj.indexAt = indexAt || 0;
    if (window.reSub && window.superMonitor.isInThePlate && dataType !== '4' && dataType !== '14' && dataType !== '23') {
      // 中断处理
      if (dataType === '7' && indexAt !== undefined && targetObj.indexAt < indexAt) {
        for (let i = targetObj.indexAt; i < indexAt; ++i) {
          if (updateData[i].isVirtual) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('webfs: 检查分时图表当前数据之前有虚拟数据, 重新发起订阅')
            //window.superMonitor[payload.type].emitTime.push(now);
            targetObj.lastEmitTime = now;
            targetObj.reEmitTime.push(now);
            targetObj.emitNum++;
            window.socket.socket && window.socket.emit('sub', { subs: targetObj.command });
            i += 242;
          }
          targetObj.indexAt = indexAt;
        }
      }
      targetObj.monitorSub = setInterval(_ => {
        // 启动定时器
        !reEmitOne && (reEmitOne = payload.type);
        if (reEmitOne === payload.type) overnight();
        if (window.reSub && window.socket.socket && targetObj.isSubscription) {
          console.log(`webfs: ${reEmitTime}秒内未接收到数据推送, 重连执行命令: `, targetObj.command)
          let now = moment().format('YYYY-MM-DD HH:mm:ss');
          //window.superMonitor[payload.type].emitTime.push(now);
          targetObj.lastEmitTime = now;
          targetObj.reEmitTime.push(now);
          targetObj.emitNum++;
          window.socket.emit('sub', { subs: targetObj.command });
        }
      }, 1000 * reEmitTime);
    }
    /* 监控参数变化与异常处理 end */

    if(!targetObj.preData || !_isEqual(state[payload.type], updateData)){
      targetObj.preData = state[payload.type];
      targetObj.isDataUpdated = {info: '存键值对, 键为组件的compId, 值为true时表示当前数据已经渲染或一次, 否则则当前数据未渲染过'};
    }
    return {
      ...state,
      [payload.type]: updateData
    }
  },

  [init]: (state, { payload }) => {
    return {
      ...state,
    }
  },

  [glbj]: (state, { payload }) => {
    // 接收关联报价数据并存入redux
    let {data} = payload;
    if(data && data.constructor === Object)data = [data];
    let  glbjData;
    if (!state[payload.type]) {
      glbjData = { data: [], count: 0 };
    } else {
      glbjData = _cloneDeep(state[payload.type]);
    }
    data.forEach(tmpData => {
      let index = glbjData.data.findIndex(item => item.uuid === tmpData.uuid);
      if(payload.isPreData){
        tmpData = {stockName: tmpData.stockName,stockCode: tmpData.stockCode,uuid: tmpData.uuid}
      }
      index > -1
        && (glbjData.data[index] = _cloneDeep(tmpData))
        || glbjData.data.push(_cloneDeep(tmpData));
    })
    glbjData.duuid = uuid();
    glbjData.startNum = glbjData.data.startNum || 0;
    glbjData.count = glbjData.data.length;

    if(!window.superMonitor[payload.type])window.superMonitor[payload.type] = {};
    let targetObj = window.superMonitor[payload.type];
    if(!targetObj.preData || !_isEqual(state[payload.type], glbjData)){
      targetObj.preData = state[payload.type];
      targetObj.isDataUpdated = {info: '存键值对, 键为组件的compId, 值为true时表示当前数据已经渲染或一次, 否则则当前数据未渲染过'};
    }
    state[payload.type] = glbjData;
    return state;
  },

  [add]: (state, { payload }) => {
    // 添加自选
    let filterData = window.selfOptions.filter(item => item.uuid === payload.data.uuid);
    filterData.length > 0 && (payload.data.upDataTime = filterData[0].upDataTime, payload.data.isNotDel = filterData[0].isNotDel);
    let newData = {};
    if (!state[payload.type]) {
      newData[payload.type] = { data: [], count: 0 };
    } else {
      newData[payload.type] = _cloneDeep(state[payload.type]);
    }
    if (!state[`option-${payload.data.asset}`]) {
      newData[`option-${payload.data.asset}`] = { data: [], count: 0 };
    } else {
      newData[`option-${payload.data.asset}`] = _cloneDeep(state[`option-${payload.data.asset}`]);
    }
    if (payload.data.asset === 5 || payload.data.asset === 6) {
      if (!state['option-0']) {
        newData['option-0'] = { data: [], count: 0 };
      } else {
        newData['option-0'] = _cloneDeep(state['option-0']);
      }
    }
    let index = newData[payload.type].data.findIndex(item => item.uuid === payload.data.uuid);
    let subIndex = newData[`option-${payload.data.asset}`].data.findIndex(item => item.uuid === payload.data.uuid);
    if (index > -1) {
      grenData({
        newData, data: payload.data,
        type: payload.type,
        index, duuid: uuid(), state,
        execType: 'add',
      });
      grenData({
        newData, data: payload.data,
        type: `option-${payload.data.asset}`,
        execType: 'add',
        index: subIndex, duuid: uuid(), state
      });
      if (payload.data.asset === 5 || payload.data.asset === 6) {
        let mysubIndex = newData['option-0'].data.findIndex(item => item.uuid === payload.data.uuid);
        grenData({
          newData, data: payload.data,
          execType: 'add',
          type: 'option-0', index: mysubIndex > -1 ? mysubIndex : undefined,
          duuid: uuid(), state, count: 1
        });
      }
    } else {
      grenData({
        newData, data: payload.data,
        execType: 'add',
        duuid: uuid(), startNum: 0,
        type: payload.type, count: 1, state
      })
      grenData({
        newData, data: payload.data,
        execType: 'add',
        duuid: uuid(), startNum: 0,
        type: `option-${payload.data.asset}`, count: 1, state
      })
      if (payload.data.asset === 5 || payload.data.asset === 6) {
        grenData({
          newData, data: payload.data,
          execType: 'add',
          duuid: uuid(), startNum: 0,
          type: 'option-0', count: 1, state
        })
      }
    }
    localStorage.setItem('option-ALL', JSON.stringify(newData['option-ALL']));
    Object.keys(newData).forEach(key => {
      if(!window.superMonitor[key])window.superMonitor[key] = {};
      let targetObj = window.superMonitor[key];
      if(!targetObj.preData || !_isEqual(state[key], newData[key])){
        targetObj.preData = state[key];
        targetObj.isDataUpdated = {info: '存键值对, 键为组件的compId, 值为true时表示当前数据已经渲染或一次, 否则则当前数据未渲染过'};
      }
    })
    return { ...state, ...newData };
  },


  [del]: (state, { payload }) => {
    // 删除自选
    let index = state[payload.type].data.findIndex(item => item.uuid === payload.data.uuid);
    let subIndex = state[`option-${payload.data.asset}`].data.findIndex(item => item.uuid === payload.data.uuid);
    let newData = {
      [payload.type]: _cloneDeep(state[payload.type]),
      [`option-${payload.data.asset}`]: _cloneDeep(state[`option-${payload.data.asset}`])
    };
    if (index > -1) {
      grenData({
        newData, index,
        execType: 'del',
        duuid: uuid(), startNum: 0,
        type: payload.type, count: -1
      })
      grenData({
        execType: 'del',
        newData, index: subIndex,
        duuid: uuid(), startNum: 0,
        type: `option-${payload.data.asset}`, count: -1
      })
      if (payload.data.asset === 5 || payload.data.asset === 6) {
        newData['option-0'] = _cloneDeep(state[`option-0`]);
        let mysubIndex = newData['option-0'].data.findIndex(item => item.uuid === payload.data.uuid);
        grenData({
          execType: 'del',
          newData, index: mysubIndex,
          duuid: uuid(), startNum: 0,
          type: 'option-0', count: -1
        })
      }
    }
    localStorage.setItem('option-ALL', JSON.stringify(newData['option-ALL']));
    return { ...state, ...newData };
  },

  [option_sort]: (state, { payload }) => {
    debugger;
  },

  [pregendataby7]: (state, { payload }) => {
    // 图表数据预生成
    if(!window.superMonitor[payload.actionName])window.superMonitor[payload.actionName] = {};
    let targetObj = window.superMonitor[payload.actionName];
    if(!targetObj.preData){
      targetObj.preData = state[payload.actionName];
      targetObj.isDataUpdated = {info: '存键值对, 键为组件的compId, 值为true时表示当前数据已经渲染过一次, 否则则当前数据未渲染过'};
    }

    if (state.pregendataby7) {
      state[payload.actionName] = _cloneDeep(state.pregendataby7);
    } else {
      let dateRange = [[9, 30], [11, 30], [13, 0], [15, 0]].map(item => moment([...moment().toArray().slice(0, 3), ...item]).unix());
      let tmpData, oneData = {};
      sampleDataKeys7.forEach(key => oneData[key] = undefined);
      oneData.isVirtual = true;
      tmpData = (new Array(242)).fill(_cloneDeep(oneData))
        .map((item, index) => ({
          ...item,
          date: new Date((dateRange[parseInt(index / 121) * 2] + (index % 121) * 60) * 1000)
        }));
      state[payload.actionName] = tmpData;
      state.pregendataby7 = _cloneDeep(tmpData);
    }
    // 用于标记为自动生成的预处理数据
    state[payload.actionName].isPregendata = true;
    return state;
  },

  [pregendataby7all]: (state, { payload }) => {
    if (state.pregendataby7) {
      Object.keys(state).forEach(key => {
        if(key.lastIndexOf('7') === key.length - 1){
          state[key] = _cloneDeep(state.pregendataby7);
        }
      })
    }
    return state;
  },
}, {
})

function grenData({ execType, newData, type, index, count, duuid, startNum, data, state }) {
  /* *************
    * 用于处理数据
    * data为新数据
    * newData为新数据承载体
    * index为数据下标, 不传时表示后面插入
    * count为数量的变化值
    * startNum为默认初始位置,
    * ************/
  try {
    if (execType === 'add') {
      index !== undefined
        && (newData[type].data[index] = _cloneDeep(data))
        || newData[type].data.push(_cloneDeep(data));
    } else if (execType === 'del') {
      newData[type].data.splice(index, 1);
    }
    //count !== undefined && index === undefined && (newData[type].count += count);
    duuid !== undefined && (newData[type].duuid = duuid);
    startNum !== undefined && (newData[type].startNum = startNum);
    newData[type].count = newData[type].data.length;
  } catch (err) {
    debugger;
  }
}

function inThePlate(data) {
  // 判断当前时间是否在盘中, 通过数据日期判断是否节假日, 通过当前时间判断是否是工作日盘中
  if (data.constructor === Array) {
    data = data[0];
  }
  if (data.duuid) {
    data = data.data[0];
  }
  let dataDate = data.date;
  let nowDate = parseInt(moment().format('YYYYMMDD'));
  if (dataDate.constructor === Date) {
    dataDate = parseInt(moment(dataDate).format('YYYYMMDD'));
  }
  if (dataDate !== nowDate) {
    return false;
  }
  let nowTime = parseInt(moment().format('HHmmss'));
  if (nowTime < 93000 || (nowTime > 113000 && nowTime < 130000) || nowTime > 150000) {
    return false;
  }
  return true;
}

function overnight() {
  // 隔夜检查
  let nowDate = parseInt(moment().format('YYYMMDD'));
  if (!isShowTipMadol && nowDate !== window.superMonitor.monitorDate) {
    isShowTipMadol = true;
    Modal.info({
      title: '更新提示',
      content: '隔夜需要更新码表, 请确认',
      onOk() {
        location.reload();
      }
    })
  }
}

export default Data;

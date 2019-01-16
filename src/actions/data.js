import { createActions } from 'redux-actions';

export const {dataupdate, monitor, init, add, del, pregendataby7, pregendataby7all, option_sort, glbj} = createActions({
  DATAUPDATE: param => param,
	MONITOR: param => param,
  INIT: param => param,
  // 添加自选
  ADD: param => param,
  // 删除自选
  DEL: param => param,
  // dataType7时预生成数据
  PREGENDATABY7: param => param,
  // 收到当日的开盘信号时清理dataType为7的数据为预生成数据
  PREGENDATABY7all: param => param,
  OPTION_SORT: param => param,
  //板块数据
  GLBJ: param => param,
});


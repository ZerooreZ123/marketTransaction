/*BOLL:MA(CLOSE,M);
UB:BOLL+2*STD(CLOSE,M);
LB:BOLL-2*STD(CLOSE,M);*/

module.exports = function BOLL({data, close, open, low, high, M=20, common}) {//dataParam格式：收盘价对应参数 如  'close'
  let tmp, vdata = common.getData();
  const keys = ['BOLL', 'UB', 'LB'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].BOLL = item.BOLL = index < M - 1? undefined: common.getMA({key: close, day: M, index});
      tmp = common.getSTD({key: close, day: M, index}) * 2;
      vdata[index].UB = item.UB = tmp === undefined? tmp: item.BOLL + tmp;
      vdata[index].LB = item.LB = tmp === undefined? tmp: item.BOLL - tmp;
    }
  })
  return {keys};
}


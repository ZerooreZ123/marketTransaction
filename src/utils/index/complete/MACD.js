module.exports = function MACD({data, close, open, low, high, SHORT=12, LONG=26, MID=9, common}) {//dataParam格式：收盘价对应参数 如  'close'
  let ans, vdata = common.getData();
  const keys = ['DIF', 'DEA', 'MACD'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].DIF = item.DIF = common.getEMA({key: close, day: SHORT, index}) - common.getEMA({key: close, day: LONG, index});
      vdata[index].DEA = item.DEA = common.getEMA({key: 'DIF', day: MID, index});
      vdata[index].MACD = item.MACD = (item.DIF - item.DEA) * 2;
    }
  })
  return {keys};
}


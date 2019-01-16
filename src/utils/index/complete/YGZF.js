/*HJ_1:=HHV(HIGH,9)-LLV(LOW,9);
HJ_2:=HHV(HIGH,9)-CLOSE;
HJ_3:=CLOSE-LLV(LOW,9);
HJ_4:=HJ_2/HJ_1*100-70;
HJ_5:=(CLOSE-LLV(LOW,60))/(HHV(HIGH,60)-LLV(LOW,60))*100;
HJ_6:=(2*CLOSE+HIGH+LOW)/4;
HJ_7:=SMA(HJ_3/HJ_1*100,3,1);
HJ_8:=LLV(LOW,34);
HJ_9:=SMA(HJ_7,3,1)-SMA(HJ_4,9,1);
HJ_10:=IF(HJ_9>100,HJ_9-100,0);
HJ_11:=HHV(HIGH,34);
HJ_12:=EMA((HJ_6-HJ_8)/(HJ_11-HJ_8)*100,8);
HJ_13:=EMA(HJ_12,5);*/
module.exports = function YGZF({data, close, open, low, high, common}) {//dataParam格式：收盘价对应参数 如  'close'
  let vdata = common.getData();
  const keys = ['HJ_12', 'HJ_13', 'secondIndLine', 'buyLine', 'baseLine', 'highLine', 'sellSign', 'buySign', 'lineHJflag'];
  const {REF} = common;
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].HJ_1 = common.getHHV({key: high, day: 9, index}) - common.getLLV({key: low, day: 9, index});
      vdata[index].HJ_2 = common.getHHV({key: high, day: 9, index}) - item[close];
      vdata[index].HJ_3 = item[close] - common.getLLV({key: low, day: 9, index});
      vdata[index].HJ_4 = item.HJ_2 / item.HJ_1 * 100 - 70;
      vdata[index].HJ_5 = (item[close] - common.getLLV({key: low, day: 60, index})) / (common.getHHV({key: high, day: 60, index}) - common.getLLV({key: low, day: 60, index})) * 100;
      vdata[index].HJ_6 = (2 * item[close] + item[high] + item[low]) / 4;
      vdata[index].HJ_7_tmp = vdata[index].HJ_3 / vdata[index].HJ_1 * 100;
      vdata[index].HJ_7 = common.getSMA({key: 'HJ_7_tmp', day: 3, weight: 1, index});
      vdata[index].HJ_8 = common.getLLV({key: low, day: 34, index});
      vdata[index].HJ_9 = common.getSMA({key: 'HJ_7', day: 3, weight: 1, index}) - common.getSMA({key: 'HJ_4', day: 9, weight: 1, index});
      vdata[index].HJ_10 = vdata[index].HJ_9 > 100? vdata[index].HJ_9 - 100: 0;
      vdata[index].HJ_11 = common.getHHV({key: high, day: 34, index});
      vdata[index].HJ_12_tmp = (vdata[index].HJ_6 - vdata[index].HJ_8) / (vdata[index].HJ_11 - vdata[index].HJ_8) * 100;
      vdata[index].HJ_12 = item.HJ_12 = common.getEMA({key: 'HJ_12_tmp', day: 8, index});
      vdata[index].HJ_13 = item.HJ_13 = common.getEMA({key: 'HJ_12', day: 5, index});
      // 第二指标交叉线
      vdata[index].secondIndLine = item.secondIndLine = vdata[index].HJ_12 - vdata[index].HJ_13;
      // 买入条件
      vdata[index].buyLine = item.buyLine = -item.secondIndLine;
      // 基准线
      vdata[index].baseLine = item.baseLine = 0;
      // 高位线
      vdata[index].highLine = item.highLine = 85;
      // 机会线
      vdata[index].opportunityLine = item.opportunityLine = 50;
      vdata[index].sellSign = item.sellSign = (REF('secondIndLine', 1, index) > 0 && item.secondIndLine <= 0 || (item.secondIndLine < 1 && item.secondIndLine >= 0 && item[close] < item[open])) && 1 || 0;
      vdata[index].buySign = item.buySign = (item.sellSign === 0 && REF('secondIndLine', 1, index) < 0 && item.secondIndLine > 0) && 1 || 0;
      (item.HJ_12 > 0 && item.HJ_12 - item.HJ_13 >= 0) && (vdata[index].lineHJflag = item.lineHJflag = 0);
      (item.HJ_12 > 0 && item.HJ_12 - item.HJ_13 < 0) && (vdata[index].lineHJflag = item.lineHJflag = 1);
    }
  })
  return {keys};
}

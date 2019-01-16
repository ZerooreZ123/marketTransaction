/*MTR:=SUM(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N);
HD :=HIGH-REF(HIGH,1);
LD :=REF(LOW,1)-LOW;
DMP:=SUM(IF(HD>0&&HD>LD,HD,0),N);
DMM:=SUM(IF(LD>0&&LD>HD,LD,0),N);
PDI: DMP*100/MTR;
MDI: DMM*100/MTR;
ADX: MA(ABS(MDI-PDI)/(MDI+PDI)*100,M);
ADXR:(ADX+REF(ADX,M))/2;
*/
module.exports = function DMI({data, close, open, low, high, N=14, M=6, common}) {
  let vdata = common.getData(), tmp1, tmp2;
  const {MAX, REF, ABS, SUM} = common;
  const keys = ['PDI', 'MDI', 'ADX', 'ADXR'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].MTR_tmp = MAX(MAX(item[high] - item[low], ABS(item[high] - REF(close, 1, index))), ABS(REF(close, 1, index) - item[low]));
      vdata[index].MTR = SUM('MTR_tmp', N, index);
      tmp1 = item[high] - REF(high, 1, index);
      tmp2 = REF(low, 1, index) - item[low];
      vdata[index].DMP_tmp = tmp1 > 0 && tmp1 > tmp2 && tmp1 || 0;
      vdata[index].DMM_tmp = tmp2 > 0 && tmp2 > tmp1 && tmp2 || 0;
      vdata[index].DMP = SUM('DMP_tmp', N, index);
      vdata[index].DMM = SUM('DMM_tmp', N, index);
      vdata[index].PDI = item.PDI = vdata[index].DMP * 100 / vdata[index].MTR;
      vdata[index].MDI = item.MDI = vdata[index].DMM * 100 / vdata[index].MTR;
      vdata[index].ADX_tmp = ABS(item.MDI - item.PDI) / (item.MDI + item.PDI) * 100;
      vdata[index].ADX = item.ADX = common.getMA({key: 'ADX_tmp', day: M, index});
      vdata[index].ADXR = item.ADXR = (item.ADX + REF('ADX', M, index)) / 2;
    }
  })
  return {keys};
}

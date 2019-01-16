/*CCI 商品路径指标	TYP:=(HIGH+LOW+CLOSE)/3;
CCI:(TYP-MA(TYP,N))/(0.015*AVEDEV(TYP,N));*/
import common from '../common'

export default function CCI({data: TDXArr, high: high = "high", low: low = 'low', close: close = 'close', N: N = 14}) {//dataParam格式：最高价,最低价,收盘价 如  'high,low,close'
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].TYP = (TDXArr[i][high] + TDXArr[i][low] + TDXArr[i][close]) / 3
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].CCI = (TDXArr[i].TYP - common.MA('TYP', N)) / (0.015 * common.AVEDEV('TYP', N))
	}
}
module.exports = function MACD({data, close, open, low, high, N=14, common}) {//dataParam格式：收盘价对应参数 如  'close'
  let ans, vdata = common.getData();
  const keys = ['CCI'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].TYP = (item[high] + item[low] + item[close]) / 3;
      vdata[index].CCI = item.CCI = (vdata[index].TYP - common.getMA({key: 'TYP', day: N, index})) / (0.015);

      vdata[index].DIF = item.DIF = common.getEMA({key: close, day: S, index}) - common.getEMA({key: close, day: L, index});
      vdata[index].DEA = item.DEA = common.getEMA({key: 'DIF', day: MID, index});
      vdata[index].MACD = item.MACD = (item.DIF - item.DEA) * 2;
    }
  })
}

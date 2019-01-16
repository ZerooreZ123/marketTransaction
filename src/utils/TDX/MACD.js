import EMA from './common';

export default function MACD({data: TDXArr, key: dataParam='close', fast: S=12, slow: L=26, signal: MID=9}) {//dataParam格式：收盘价对应参数 如  'close'
	for (var i = 0; i < TDXArr.length; i++) {//i==0代表今天
		TDXArr[TDXArr.length - 1 - i].DIF = EMA(TDXArr, dataParam, S, i) - EMA(TDXArr, dataParam, L, i)
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[TDXArr.length - 1 - i].DEA = EMA(TDXArr, 'DIF', MID, i)
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].MACD = (TDXArr[i].DIF - TDXArr[i].DEA) * 2
	}
}

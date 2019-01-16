import common from '../common'
/*MTR:=EMA(EMA(EMA(CLOSE,N),N),N);
TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
MATRIX:MA(TRIX,M) ;
*/

export default function TRIX({data: TDXArr, close: close = 'close', N: N = 12, M: M = 9}) {//dataParam格式：收盘价对应参数 如  'close'
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].E1 = common.EMA(TDXArr, close, N, i, true)
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].E2 = common.EMA(TDXArr, 'E1', N, i, true)
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].MTR = common.EMA(TDXArr, 'E2', N, i, true);
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].TRIX = (TDXArr[i].MTR - common.REF(TDXArr, 'MTR', 1, i)) / common.REF(TDXArr, 'MTR', 1, i) * 100;
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].MATRIX = i > M - 2 ? common.MA(TDXArr, 'TRIX', M, i) : NaN
	}
}


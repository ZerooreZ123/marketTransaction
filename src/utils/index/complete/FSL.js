import common from '../common'
/*SWL:(EMA(CLOSE,5)*7+EMA(CLOSE,10)*3)/10;
SWS:DMA(EMA(CLOSE,12),MAX(1,100*(SUM(VOL,5)/(3*CAPITAL))));*/

export default function FSL({data: TDXArr, close: close = 'close', volume: vol = 'volume', CAPITAL: capital = 'CAPITAL'}) {//dataParam格式：收盘价对应参数 如  'close'
	if (!dataParam) {
	} else {
		var dataParamArr = dataParam.split(',')
		var close = dataParamArr[0]
		var vol = dataParamArr[1]
		var capital = dataParamArr[2]
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].SWL = (common.EMA(close, 5) * 7 + common.EMA(close, 10) * 3) / 10
		TDXArr[i].SWS = common.DMA(common.EMA(close, 12), MAX(1, 100 * (SUM(vol, 5) / (3 * TDXArr[i][capital]))));
	}
}


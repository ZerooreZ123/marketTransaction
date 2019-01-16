import common from '../common'
/*MID:=REF(HIGH+LOW,1)/2;
CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
MA1:REF(MA(CR,M1),M1/2.5+1);
MA2:REF(MA(CR,M2),M2/2.5+1);
MA3:REF(MA(CR,M3),M3/2.5+1);
MA4:REF(MA(CR,M4),M4/2.5+1);

*/

export default function CR({data: TDXArr, high: high = 'high', low: low = 'low', N: N = 26, M1: M1 = 10, M2: M2 = 20, M3: M3 = 40, M4: M4 = 62}) {//dataParam格式：收盘价对应参数 如  'close'
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['high+low'] = parseFloat(TDXArr[i][high]) + parseFloat(TDXArr[i][low])
		TDXArr[i].MID = common.REF(TDXArr, 'high+low', 1, i) / 2;

		TDXArr[i]['max:' + high + '-MID'] = common.MAX(0, TDXArr[i][high] - TDXArr[i].MID)
		TDXArr[i]['max:' + 'MID-' + low] = common.MAX(0, TDXArr[i].MID - TDXArr[i][low])
		TDXArr[i].CR = common.SUM(TDXArr, 'max:' + high + '-MID', N, i) / common.SUM(TDXArr, 'max:' + 'MID-' + low, N, i) * 100;
		TDXArr[i].CRMA1 = common.MA(TDXArr, 'CR', M1, i)
		TDXArr[i].CRMA2 = common.MA(TDXArr, 'CR', M2, i)
		TDXArr[i].CRMA3 = common.MA(TDXArr, 'CR', M3, i)
		TDXArr[i].CRMA4 = common.MA(TDXArr, 'CR', M4, i)
		var num_M1 = Math.ceil(M1 / 2.5)
		var num_M2 = Math.ceil(M2 / 2.5)
		var num_M3 = Math.ceil(M3 / 2.5)
		var num_M4 = Math.ceil(M4 / 2.5)
		TDXArr[i].MA1 = i >= M1 + num_M1 ? common.REF(TDXArr, 'CRMA1', num_M1 + 1, i) : NaN;
		TDXArr[i].MA2 = i >= M2 + num_M2 ? common.REF(TDXArr, 'CRMA2', num_M2 + 1, i) : NaN;
		TDXArr[i].MA3 = i >= M3 + num_M3 ? common.REF(TDXArr, 'CRMA3', num_M3 + 1, i) : NaN;
		TDXArr[i].MA4 = i >= M4 + num_M4 ? common.REF(TDXArr, 'CRMA4', num_M4 + 1, i) : NaN;
	}
}


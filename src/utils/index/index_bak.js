'use strict'
import MACD from './complete/MACD' //完成
// import BOLL from './complete/BOLL'//完成
// import YGZF from './complete/YGZF'//完成
// import DMI from './complete/DMI'//完成
// import KDJ from './complete/KDJ'//完成
// import TRIX from './complete/TRIX'//完成
// import CR from './complete/CR'//完成

console.time()
// BOLL({
// 	data: TDXData,
// })
MACD({
	data: TDXData,
})

console.timeEnd()
// console.log(TDXData);
for (var i = 0; i < TDXData.length; i++) {
	console.log(TDXData[i].date.substring(0, 10), TDXData[i]['MACD']);
}
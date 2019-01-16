/*说明：求绝对值
用法：ABS(X)返回X的绝对值
例如：ABS(-23)返回23*/
function ABS(X) {
	if (X) {
		return Math.abs(X)
	} else {
		console.error('参数错误');
	}
}

/*说明：求指数移动平均
用法：EMA(X,N),求X的N日指数平滑移动平均。若Y=EMA(X,N)则Y=[2*X+(N-1)*Y']/(N+1),其中Y'表示上一周期Y值
	例如：EMA(CLOSE,22)表示求22日指数平滑均价*/

function EMA(TDXArr, X, N, end) {
	// var arr1 = []
	var count = TDXArr.length - 1 - end//当天
	function EMAFunc(X, N) {
		if (TDXArr[count][X + '-EMA' + N]) {
			return TDXArr[count][X + '-EMA' + N]
		}
		if (count == 0) {//最早的值
			// count = -1
			// var data = jsChu(2, (N + 1) * TDXArr[0][X]) + jsChen((1 - 2 / (N + 1)), TDXArr[0][X])
			var data = 2 / (N + 1) * TDXArr[0][X] + (1 - 2 / (N + 1)) * TDXArr[0][X]
			TDXArr[0][X + '-EMA' + N] = data
			return data
		}
		// var data = jsChu(2, (N + 1) * TDXArr[count--][X]) + jsChen((1 - 2 / (N + 1)), EMAFunc(X, N))
		var data = 2 / (N + 1) * TDXArr[count--][X] + (1 - 2 / (N + 1)) * EMAFunc(X, N)
		if (count < TDXArr.length) {
			count++
			if (!TDXArr[count][X + '-EMA' + N]) {
				TDXArr[count][X + '-EMA' + N] = data
			}
		}
		// arr1.push(data)
		return data
		// EMA1 = 2 / (几日 + 1) * 当日收盘价 + (1 - 2 / (几日 + 1)) * EMA2
		// EMA2 = 2 / (几日 + 1) * 昨日收盘价 + (1 - 2 / (几日 + 1)) * EMA3
		// EMAN = 2 / (几日 + 1) * 第一天收盘价 + (1 - 2 / (几日 + 1)) * 第一天收盘价
	}

	var result = EMAFunc(X, N)
	// return arr1.reverse()
	return result
}

/*说明：求最高值
用法：HHV(X,N),求N周期内X最高值,N=0则从第一个有效值开始
例如：HHV(HIGH,22),表示求22日最高价*/
function HHV(X, N) {
	if (X) {
		var max = TDXArr[0][X]
		if (N < 0) {
			N = 0
		}
		for (var i = N; i < TDXArr.length; i++) {
			if (parseFloat(TDXArr[i][X]) > parseFloat(max)) {
				max = TDXArr[i][X]
			}
		}
		return parseFloat(max)
	} else {
		console.error('参数错误');
	}
}

/*说明：求最低值
用法：LLV(X,N),求N周期内X最低值,N=0则从第一个有效值开始
例如：LLV(LOW,0),表示求历史最低价*/
function LLV(X, N) {
	if (X) {
		var min = TDXArr[0][X]
		if (N < 0) {
			N = 0
		}
		for (var i = N; i < TDXArr.length; i++) {
			if (parseFloat(TDXArr[i][X]) < parseFloat(min)) {
				min = TDXArr[i][X]
			}
		}
		return parseFloat(min)
	} else {
		console.error('参数错误');
	}
}

/*说明：返回简单移动平均
用法：MA(X,M),X的M日简单移动平均*/
function MA(X, M) {
	if (X) {
		var num = 0
		for (var i = TDXArr.length - M; i < TDXArr.length; i++) {
			num = num + parseFloat(TDXArr[i][X])
		}
		return num / M
	} else {
		console.error('参数错误');
	}
}

/*说明：求模运算
用法：MOD(A,B)返回A对B求模
例如：MOD(18,10)返回8*/
function MOD(A, B) {
	if (A && B) {
		return parseFloat(A) % parseFloat(B)
	} else {
		console.error('参数错误');
	}
}

/*说明：引用若干周期前的数据
用法：REF(X,A),引用A周期前的X值
例如：REF(CLOSE,1),表示上一周期的收盘价,在日线上表示昨收价*/
function REF(X, A) {
	if (X) {
		return X[X.length - (A + 1)]
	} else {
		console.error('参数错误');
	}
}

/*说明：返回移动平均
用法：SMA(X,N,M),X的N日移动平均,M为权重,若Y=SMA(X,N,M)则Y=(X*M+Y'*(N-M))/N*/
function SMA(X, N, M) {
	var count = TDXArr.length - 1

	function SMAFunc(X, N, M) {
		if (TDXArr[count][X + '-SMA' + N]) {
			return TDXArr[count][X + '-SMA' + N]
		}
		if (count == 0) {
			var data = TDXArr[0][X]
			TDXArr[0][X + '-SMA' + N] = data
			return data
		}
		var data = (TDXArr[count--][X] * M + SMAFunc(X, N, M) * (N - M)) / N
		if (count < TDXArr.length) {
			count++
			if (!TDXArr[count][X + '-SMA' + N]) {
				TDXArr[count][X + '-SMA' + N] = data
			}
		}
		return data
	}

	var result = SMAFunc(X, N, M)
	return result
}

/*说明：求总和
用法：SUM(X,N),统计N周期中X的总和,N=0则从第一个有效值开始
例如：SUM(VOL,0),表示统计从上市第一天以来的成交量总和*/
function SUM(X, N) {
	if (X && !isNaN(N)) {
		var r = 0
		for (var i = N; i < TDXArr.length; i++) {
			r = r + parseFloat(TDXArr[i][X])
		}
		console.log(r);
		return r
	} else {
		console.error('参数错误');
	}
}

/*说明：N日平均绝对偏差
用法：AVEDEV(X,N)*/
function AVEDEV(X, N) {
	if (X) {
		var num = 0
		for (var i = TDXArr.length - N; i < TDXArr.length; i++) {
			num = num + parseFloat(TDXArr[i][X])
		}
		return num / N
	} else {
		console.error('参数错误');
	}
}

export default EMA;

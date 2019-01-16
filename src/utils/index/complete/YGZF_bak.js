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
import common from '../common'

export default function YGZF({data: TDXArr, high: high = 'high', low: low = 'low', close: close = 'close', open: open = 'open'}) {//dataParam格式：最高价,最低价,收盘价 如  'high,low,close'
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i][high] = parseFloat(TDXArr[i][high])
		TDXArr[i][low] = parseFloat(TDXArr[i][low])
		TDXArr[i][close] = parseFloat(TDXArr[i][close])
		TDXArr[i]['HJ_1'] = common.HHV(TDXArr, high, 9, i) - common.LLV(TDXArr, low, 9, i);
		TDXArr[i]['HJ_2'] = common.HHV(TDXArr, high, 9, i) - TDXArr[i][close];
		TDXArr[i]['HJ_3'] = TDXArr[i][close] - common.LLV(TDXArr, low, 9, i);
		TDXArr[i]['HJ_4'] = TDXArr[i]['HJ_2'] / TDXArr[i]['HJ_1'] * 100 - 70;
		TDXArr[i]['HJ_5'] = (TDXArr[i][close] - common.LLV(TDXArr, low, 60, i)) / (common.HHV(TDXArr, high, 60, i) - common.LLV(TDXArr, low, 60, i)) * 100;
		TDXArr[i]['HJ_6'] = (2 * TDXArr[i][close] + TDXArr[i][high] + TDXArr[i][low]) / 4;
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['HJ_3/HJ_1*100'] = TDXArr[i]['HJ_3'] / TDXArr[i]['HJ_1'] * 100
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['HJ_7'] = common.SMA(TDXArr, 'HJ_3/HJ_1*100', 3, 1, i, true);
		TDXArr[i]['HJ_8'] = common.LLV(TDXArr, low, 34, i);
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['HJ_9'] = common.SMA(TDXArr, 'HJ_7', 3, 1, i) - common.SMA(TDXArr, 'HJ_4', 9, 1, i);

		TDXArr[i]['HJ_10'] = TDXArr[i]['HJ_9'] > 100 ? TDXArr[i]['HJ_9'] - 100 : 0;
		TDXArr[i]['HJ_11'] = common.HHV(TDXArr, high, 34, i);
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['(HJ_6-HJ_8)/(HJ_11-HJ_8)*100'] = (TDXArr[i]['HJ_6'] - TDXArr[i]['HJ_8']) / (TDXArr[i]['HJ_11'] - TDXArr[i]['HJ_8']) * 100
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['HJ_12'] = common.EMA(TDXArr, '(HJ_6-HJ_8)/(HJ_11-HJ_8)*100', 8, i, true);
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i]['HJ_13'] = common.EMA(TDXArr, 'HJ_12', 5, i);
	}
	for (var i = 0; i < TDXArr.length; i++) {
		TDXArr[i].lineArr = []
		var obj = {}
		var maichu;
		var mairu;
		if (i == 0) {
			var yesterLine = TDXArr[i]['HJ_12'] - TDXArr[i]['HJ_13']//1日前的第二指标交叉线
		} else {
			var yesterLine = TDXArr[i - 1]['HJ_12'] - TDXArr[i - 1]['HJ_13']//1日前的第二指标交叉线
		}
		//style 画图样式 多个用逗号,分割 例"solid_column,text"
		// solid_column 实心柱
		// hollow_column 空心柱
		// solid_line 实心线
		// text 显示lable
		// none 画图 线条颜色透明

		//interval 画图数据区间 [a,b] array
		//data 画图数据数值 num
		//name lable的显示文字 string
		//width 线宽或柱宽 num
		//color 线颜色或柱颜色 string
		var toLine = TDXArr[i]['HJ_12'] - TDXArr[i]['HJ_13']//今日第二指标交叉线
		obj.line1 = (TDXArr[i]['HJ_12'] > 0 && toLine >= 0) ? {
			interval: [19, 20],
			style: 'solid_column',
			width: 0,
			color: '#ff0000'
		} : {
			interval: [19, 20],
			style: 'hollow_column',
			width: 0,
			color: '#008000'
		}
		obj.line2 = {
			data: toLine,
			width: 2,
			style: 'solid_line,text',
			color: '#ff0000',
			name: '第二指标交叉线'
		}
		if (toLine != 0) {
			obj.line3 = (toLine > 0) ? {
				interval: [TDXArr[i]['HJ_12'], TDXArr[i]['HJ_13']],
				style: 'solid_column',
				width: 2,
				color: '#ff0000'
			} : {
				interval: [TDXArr[i]['HJ_12'], TDXArr[i]['HJ_13']],
				style: 'solid_column',
				width: 2,
				color: '#008000'
			}
		}
		obj.line4 = {
			data: -(toLine),
			width: 2,
			style: 'text',
			color: '#ffff00',
			name: '买入条件'
		}

		if (i > 0) {
			if ((yesterLine > 0 && toLine <= 0) || (toLine < 1 && toLine >= 0 && TDXArr[i][close] - TDXArr[i][open] < 0)) {
				obj.line5 = {
					data: -(toLine),
					width: 2,
					style: 'text',
					color: '#ff0000',
					name: '卖出'
				}
				maichu = true
			}
		}
		obj.line6 = {
			data: 85,
			width: 2,
			style: 'solid_line,text',
			color: '#ff0000',
			name: '高位线'
		}
		obj.line7 = {
			data: 20,
			width: 0,
			style: 'none,text',
			color: '#008000',
			name: '机会线'
		}
		obj.line8 = {
			data: 0,
			width: 2,
			style: 'solid_line,text',
			color: '#ff00ff',
			name: '底线'
		}
		if (!maichu && yesterLine < 0 && toLine > 0) {
			mairu = true
		}

		obj.line9 = {
			data: 0,
			width: 2,
			style: 'text',
			color: '#e0ffff',
			name: '买入'
		}
		if (mairu) {
			console.log('买入', i);
			obj.line9.data = 1
		}
		if (mairu) {
			obj.line10 = {
				interval: [0, 22],
				width: 2,
				style: 'solid_column',
				color: '#ffff00',
			}
			obj.line11 = {
				interval: [0, 15],
				width: 5,
				style: 'solid_column',
				color: '#ff00ff',
				name: '加仓'
			}
			obj.line12 = {
				interval: [0, 5],
				width: 5,
				style: 'solid_column',
				color: '#FF7700',
			}
			obj.line13 = {
				interval: [0, 5],
				width: 4.5,
				style: 'solid_column',
				color: '#FF8800',
			}
			obj.line14 = {
				interval: [0, 5],
				width: 4,
				style: 'solid_column',
				color: '#FF9900',
			}
			obj.line15 = {
				interval: [0, 5],
				width: 3.5,
				style: 'solid_column',
				color: '#FFAA00',
			}
			obj.line16 = {
				interval: [0, 5],
				width: 3,
				style: 'solid_column',
				color: '#FFBB00',
			}
			obj.line17 = {
				interval: [0, 5],
				width: 2.5,
				style: 'solid_column',
				color: '#FFCC00',
			}
			obj.line18 = {
				interval: [0, 5],
				width: 2,
				style: 'solid_column',
				color: '#FFDD00',
			}
			obj.line19 = {
				interval: [0, 5],
				width: 1,
				style: 'solid_column',
				color: '#FFEE00',
			}
			obj.line20 = {
				interval: [0, 15],
				width: 4.5,
				style: 'solid_column',
				color: '#102099',
			}
			obj.line21 = {
				interval: [0, 15],
				width: 4,
				style: 'solid_column',
				color: '#1020AA',
			}
			obj.line22 = {
				interval: [0, 15],
				width: 3.5,
				style: 'solid_column',
				color: '#1020BB',
			}
			obj.line23 = {
				interval: [0, 15],
				width: 3,
				style: 'solid_column',
				color: '#1020CC',
			}
			obj.line24 = {
				interval: [0, 15],
				width: 2.5,
				style: 'solid_column',
				color: '#1020DD',
			}
			obj.line25 = {
				interval: [0, 15],
				width: 2,
				style: 'solid_column',
				color: '#1020EE',
			}
			obj.line26 = {
				interval: [0, 15],
				width: 1,
				style: 'solid_column',
				color: '#ffff00',
			}
		}
		for (var k in obj) {
			TDXArr[i].lineArr.push(obj[k])
		}
	}

}
module.exports = function MA({data, close, M1 = 5, M2 = 10, M3 = 20, M4 = 60, common}) {//dataParam格式：收盘价对应参数 如  'close'
	let vdata = common.getData();
	const keys = ['MA' + M1, 'MA' + M2, 'MA' + M3, 'MA' + M4];
	data.map((item, index) => {
		if (vdata[index][keys[0]] !== undefined) {
			keys.forEach(key => item[key] = vdata[index][key]);
		} else {
			vdata[index][keys[0]] = item[keys[0]] = common.getMA({key: close, day: M1, index})
			vdata[index][keys[1]] = item[keys[1]] = common.getMA({key: close, day: M2, index})
			vdata[index][keys[2]] = item[keys[2]] = common.getMA({key: close, day: M3, index})
			vdata[index][keys[3]] = item[keys[3]] = common.getMA({key: close, day: M4, index})
		}
	})
  return {keys};
}


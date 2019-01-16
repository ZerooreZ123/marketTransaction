/**
 * 格式化工具类
 */

import { format } from 'd3-format';
import { showType } from '@/components/modules/TableColumn.js';

const moment = require('moment');

export function formDate(date, time, isformat = false) {
  time = String(time);
  date = String(date);
  time.length === 8 && (time = `0${time}`);
  if (isformat === false) {
    return moment(date + time, 'YYYYMMDDHHmmss').toDate();
  } else {
    return moment(date + time, 'YYYYMMDDHHmmss').format(isformat);
  }
}


/**
 * 时间戳转换mm:ss
 * 盘口数据
 * @export
 * @param {*} item
 * @returns
 */
export function formTime(time) {
  time = String(time)
  var t = time.substring(time.length - 9, time.length - 7) + ":" + time.substring(time.length - 7, time.length - 5)
  return t;
}

export function formDate2(time) {
  time = String(time)
  // debugger;
  var t = time.substring(4, 6) + "-" + time.substring(6, 8)
  return t;
}
// 年月日=>年
export function formDate3(time) {
  return time.slice(0, 4)
}
//年月日=>年-月-日
export function formDate4(time) {
  time = String(time)
  return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6)}`
}
/**
 * 买卖五档数字转中文
 * 盘口数据
 *
 */
export function numTransform(num, str) {
  var dw = ["一", "二", "三", "四", "五", "六", "七", "八", "九", '十'];
  return str + dw[num]
}


/**
 * 价格除以10000
 * 股票小数位判断
 *
 * @export
 * @param {*} item
 * @returns
 */
// 除以100
const FILTERASSET = ['nowVolume', 'volume', 'ask1Volume', 'bid1Volume'];
// 除以10000
const FILTERARR = [
  'close', 'high', 'open', 'low', 'price', 'preClose', 'currencyVolume', 'capitalVolume', 'nowPrice',
  'netChange', 'capitalization', 'currencyValue', 'avgPrice', 'bid1Price', 'ask1Price'
];
// 根据码表标志保留小数位数
const FILTEDECIMALRARR = [
  'close', 'high', 'open', 'low', 'price', 'preClose',
  'currencyVolume', 'capitalVolume', 'nowPrice',
  'netChangeRatioUpperRank', 'netChangeRatioDownRank', 'speedRatioUpperRank',
  'speedRatioDownRank', 'netChange',
  'iopv', 'highFor52Week', 'lowFor52Week', 'preSettlementPrice', 'settlementPrice', 'upperLimitPrice',
  'lowerLimitPrice', 'avgPrice', 'amount', 'percent', 'bidRatio', 'ask1Price', 'bid1Price',
  'volumeRatio', 'quoteRatio', 'quoteMargin',
  'weibiRatio', 'bvRatio', 'weekHigh', 'weekLow', 'highLimit', 'downLimit'
];
// 保留两位小数
const FILTERTWODECIMAL = [
  'netChangeRatio', 'amplitudeRatio', 'turnoverRatio', 'speedRatio',
  'peRatio', 'pbRatio', 'psRatio'
];

const FILTERSTOCKSTATUS = [
  'netChangeRatio', 'nowPrice', 'netChange', 'bid1Price', 'ask1Price',
  'speedRatio', 'open', 'high', 'low', 'preClose',
  'close'
];

export function filterData({ digitByCodelist = 1, digitBy2 = 1, divBai = 1, divWan = 1, isStr = 0, isTP = 0, item, symbol }) {
  if (divBai) {
    var asset = window.codelist && window.codelist.data[symbol] ? window.codelist.data[symbol].asset : 0;
    (asset === 0 || asset === 5) && FILTERASSET.map((ii, index) => {
      item[ii] && (item[ii] = Math.round(item[ii] / 100));
    })
  }
  if (divWan) {
    FILTERARR.map((ii, index) => {
      item[ii] && (item[ii] = parseFloat(item[ii]) / 10000);
    });
  }
  if (digitByCodelist) {
    var num = window.codelist && window.codelist.data[symbol] ? window.codelist.data[symbol].digit : 2;
    FILTEDECIMALRARR.map((ii, index) => {
      if (item[ii] === 0) {
        item[ii] = item[ii].toFixed(num)
      } else {
        if (isStr) {
          item[ii] && (item[ii] = parseFloat(item[ii]).toFixed(num))
        } else {
          item[ii] && (item[ii] = parseFloat(parseFloat(item[ii]).toFixed(num)))
        }
      }

    })
  }
  if (digitBy2) {
    FILTERTWODECIMAL.map((ii, index) => {
      item[ii] && (item[ii] = parseFloat(item[ii].toFixed(2)));
    })
  }
  if (isTP) {
    if (item.stockBasic.stockStatus === 0) {
      FILTERSTOCKSTATUS.map((ii, index) => {
        if (ii === 'bid1Price') {
          item[ii] = '停牌';
        } else {
          item[ii] = '--';
        }
      })
    }
  }
  return item;
}

/**
 * 沪深涨跌幅标记R/N
 *
 */
export function filterRN(data, symbol) {
  // debugger
  data.subnew = '';
  data.tradflag = '';
  try {
    if (window.codelist) {
      data.subnew = window.codelist.data[symbol].subnew == 0 ? '' : 'N';
      data.tradflag = window.codelist.data[symbol].tradflag == 0 ? '' : 'R';
    }
  }
  catch (err) {
  }
  return data;
}

/**
 * 金额格式化
 * 万 亿/保留两位小数
 * F10
 */
export function unitConvert(num, F10Flag = 0, gidit = 2) {
  if (num == 0) {
    return '0.00';
  }
  if (!num) {
    return '--';
  }
  const MONEYUNITS = ["", "万", "亿", "万亿"];
  const DIVIDENT = 10000;
  var curentNum = Number(num); //转换数字
  var curentUnit = MONEYUNITS[0]; //转换单位

  if (!F10Flag) {
    if (Math.abs(curentNum) > 1000000) {
      for (var i = 0; i < 4; i++) {
        curentUnit = MONEYUNITS[i];
        var stringNum = curentNum.toString();
        var index = stringNum.indexOf(".");
        var newNum = stringNum;
        if (index !== -1) {
          newNum = stringNum.substring(0, index);
        }

        if (newNum.length < 5) {
          break;
        }
        curentNum = curentNum / DIVIDENT;
      }
      var m = curentNum.toFixed(gidit) + curentUnit;
    } else {
      var m = curentNum.toFixed(gidit)
    }
  } else {
    if (Math.abs(curentNum) > 10000) {
      for (var i = 0; i < 4; i++) {
        curentUnit = MONEYUNITS[i];
        var stringNum = curentNum.toString();
        var index = stringNum.indexOf(".");
        var newNum = stringNum;
        if (index !== -1) {
          newNum = stringNum.substring(0, index);
        }

        if (newNum.length < 5) {
          break;
        }
        curentNum = curentNum / DIVIDENT;
      }
      var m = curentNum.toFixed(gidit) + curentUnit;
    } else {
      var m = curentNum.toFixed(gidit)
    }
  }

  return m;
}

/**
 * 获取当前时间前几个月/年
 * 增加每月天数和润年验证
 *
 */
export function getMonthYestdy(month, year, flag = '') {
  var date = new Date();
  var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
  var strYear = date.getFullYear();
  var strDay = date.getDate();
  var strMonth = date.getMonth() + 1;
  if (strYear % 4 === 0 && strYear % 100 !== 0) {//一、解决闰年平年的二月份天数   //平年28天、闰年29天//能被4整除且不能被100整除的为闰年
    daysInMonth[2] = 29;
  }
  if (strMonth - month <= 0) //二、解决跨年问题
  {
    strYear -= 1;
    strMonth = 12 + strMonth - month;
  }
  else {
    strMonth -= month;
  }
  strDay = Math.min(strDay, daysInMonth[strMonth]);//三、前一个月日期不一定和今天同一号，例如3.31的前一个月日期是2.28；9.30前一个月日期是8.30

  if (strMonth < 10)//给个位数的月、日补零
  {
    strMonth = "0" + strMonth;
  }
  if (strDay < 10) {
    strDay = "0" + strDay;
  }
  strYear -= year;
  return strYear + flag + strMonth + flag + strDay;
}

/**
 * 传入数据返回转换成6位字符的数据
 * transfromData(data, key, isNum):
 *   data: 数据
 *   key: 键名
 *   isNum: 标志
 */
function transfromDataHelp(data, i, isNum, uuid, key, showTyped) {
  if (isNum && i === 6) return parseInt(data);
  if (data === '0' || data === 0) {
    let num = 2;
    if (uuid && window.codelist && window.codelist.data[uuid] && FILTEDECIMALRARR.indexOf(key) > -1) {
      num = window.codelist.data[uuid].digit;
    }
    return `0.${(new Array(num)).fill('0').join('')}`;
  }
  let { digit = 2 } = showTyped === showType.price && FILTEDECIMALRARR.indexOf(key) > -1 && uuid && window.codelist.data[uuid] || {};
  data = format(`.${digit}f`)(data);
  let [x, y = ''] = data.split('.');
  // 位数达到指定数量时不需要加0
  if ((x + y).length >= i) {
    if (x.length >= i) {
      data = x;
    } else {
      data = `${x}.${y.slice(0, i - x.length)}`;
    }
    return data;
  }
  x = x.length, y = y.length || 0;
  let n = i - x - y;
  if (n > 0 && y < digit) {
    if (y === 0) data += '.';
    data += '0';
    if (n - 1 > 0 && y < digit - 1) {
      data += '0';
    }
  }
  return data;
}
export function transfromData({ data, uuid, info: { dataIndex = 'price', isNum = false, showTyped = 'price', zeroReplace = false } = {} }, sign) {
  if (sign) debugger;
  let key = dataIndex;
  if (data === undefined) {
    return '--';
  }
  if (showTyped === showType.origin) {
    return data;
  }
  //if(data.constructor !== Number){
  //  return data;
  //}
  if (isNaN(data)) {
    return data;
  }
  data = parseFloat(data);
  if (data === 0) {
    if (zeroReplace !== false) return zeroReplace;
    return isNum ? String(data) : transfromDataHelp(data, 6, isNum, uuid, key, showTyped);
  }
  if ((data > 0 && data < 1000000) || (data < 0 && data > -1000000)) {
    return transfromDataHelp(data, 6, isNum, uuid, key, showTyped);
  }
  if ((data > 0 && data < 100000000) || (data < 0 && data > -100000000)) {
    return transfromDataHelp(data / 10000, 4, isNum, uuid, key, showTyped) + '万';
  }
  if ((data > 0 && data < 1000000000000) || (data < 0 && data > -1000000000000)) {
    return transfromDataHelp(data / 100000000, 4, isNum, uuid, key, showTyped) + '亿';
  }
  //if((data > 0 && data < 1000000000000) || (data < 0 && data > -1000000000000)){
  return transfromDataHelp(data / 1000000000000, 2, isNum, uuid, key, showTyped) + '万亿';
  //}
}


/**
 * F10事件总览
 * 已经做过过滤
 *
 */
var _i = 0;
export function getBasSpclNtcTypeCode(code) {
  switch (code) {
    case 1:
      return { name: '股票分红', color: '#723d1c' };
    case 2:
      return { name: '大宗交易', color: '#4b6bb0' };
    case 3:
      return { name: '违规处罚', color: '#521315' };
    case 4:
      return { name: '龙虎榜', color: '#723d1c' };
    case 5:
      return { name: '公告提示', color: '#4b6bb0' };
    case 6:
      return { name: '首次发行', color: '#723d1c' };
    case 7:
      return { name: '公开增发', color: '#521315' };
    case 8:
      return { name: '非公开增发', color: '#723d1c' };
    case 9:
      return { name: '配股', color: '#3c4b1a' };
    case 10:
      return { name: '收益分配', color: '#18544a' };
    case 11:
      return { name: '销售流通', color: '#723d1c' };
    case 12:
      return { name: '股东大会', color: '#3c4b1a' };
    case 13:
      return { name: '公告停牌', color: '#723d1c' };
    case 14:
      return { name: '事项变更', color: '#16555f' };
    case 15:
      return { name: '证券交易状态', color: '#723d1c' };
    case 16:
      return { name: '风险提示', color: '#521315' };
    default:
      return { name: '', color: '' };
  }
}

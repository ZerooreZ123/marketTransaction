import _maxBy from 'lodash/maxBy';
import _minBy from 'lodash/minBy';
import _round from 'lodash/round';
import _cloneDeep from 'lodash/cloneDeep';
import { timeFormat } from "d3-time-format";

export function getLimitValue({data, rightKey='netChangeRatio', leftKey='price', bottomKey='nowVolume', middNum=1, leftKeyAbout="avgPrice"}){
  /* *******************
    * 依次返回右侧坐标轴显示数据, 右侧范围数据, 左侧坐标轴显示数组, 左侧返回数组, 下方柱状图最大值
    * ******************/
  let [maxItem, minItem] = [
    _maxBy(data, item => Math.max(item[leftKey], item[leftKeyAbout])),
    _minBy(data, item => Math.min(item[leftKey], item[leftKeyAbout]))
  ];
  if(!maxItem)return false;
  if(maxItem === minItem && maxItem[rightKey] === 0){
    // 当最大和最小的涨跌幅都为0, 则为停牌股票
    let newRatio = middNum * 0.2, newPrice = maxItem[rightKey] === 0 && minItem[rightKey] === 0? maxItem.preClose: maxItem[leftKey];
    maxItem = {...maxItem, [rightKey]: newRatio, [leftKey]: newPrice * (1 + 0.01 * newRatio)};
    minItem = {...minItem, [rightKey]: newRatio * -1, [leftKey]: newPrice * (1 - 0.01 * newRatio)};
  }
  const zeroPrice = _round(maxItem[leftKey] / (1 + maxItem[rightKey] * 0.01), 2);
  const tmpa = Math.abs(Math.max(maxItem[leftKey], maxItem[leftKeyAbout]) - zeroPrice)
      , tmpb = Math.abs(Math.min(minItem[leftKey], minItem[leftKeyAbout]) - zeroPrice);
  let [maxAbsPrice, maxAbsItem] = tmpa > tmpb? [tmpa, maxItem]: [tmpb, minItem]
  if(maxAbsPrice < middNum * 0.01){
    // 价格出现重复处理
    maxAbsPrice = middNum * 0.01;
  }
  let ans = [zeroPrice], res = [], bottomMax;
  for(var da = maxAbsPrice / middNum, i = 1; i <= middNum; i++){
    ans.push(zeroPrice + da * i);
    ans.unshift(zeroPrice - da * i);
  }
  res = Array.from(ans, item => (item - zeroPrice) / zeroPrice * 100);
  bottomKey && (bottomMax = _maxBy(data, bottomKey)[bottomKey]);
  //let hifAnsOne = (ans[middNum + 1] - ans[middNum]) / 2
  //  , hifResOne = (res[middNum + 1] - res[middNum]) / 2;
  return [
    res, // 主图表Y轴显示点位集合
    [res[0], res[res.length - 1]], // 主图表Y轴显示范围
    ans, // 附图表Y轴显示点位集合
    [ans[0], ans[ans.length - 1]], // 附图表Y轴显示范围
    bottomMax, //  底部Y轴显示范围集合
    [minItem, maxItem], // 最大值与最小值所在对象集合
  ]
}

export function getLimitValueBySmallKline({ data, bottomKey='volume', middNum=1 }){
  const [maxItem, minItem, maxPrice, minPrice] = [_maxBy(data, 'maxPrice'), _minBy(data, 'minPrice'), _maxBy(data, 'close'), _minBy(data, 'close')];
  if(!maxItem)return false;
  const maxBottom = _maxBy(data, bottomKey), ans = [];
  let oneVal = (maxItem.maxPrice - minItem.minPrice) / (middNum * 2);
  for(let i = 0; i <= middNum * 2; i++){
    ans.push(minItem.minPrice + oneVal * i);
  }
  return [
    ans,
    maxBottom[bottomKey]
  ]
}

export function autoTickFormat(data, index, chartWidth){
  // 下方tick条显示
  let xscale = this.node && this.node.getChildContext().xScale.domain();
  if(!xscale && data){
    xscale = [data.length - this.showNum, data.length - 1];
  }
  xscale[0] = Math.ceil(xscale[0]);
  xscale[1] = parseInt(xscale[1]);
  let dataNum = xscale[1] - Math.ceil(xscale[0]) + 1
    , itemWid = chartWidth / dataNum
    , showNum = Math.ceil(70 / itemWid)
    , ans = '';
  if(index >= xscale[0] && index <= xscale[1]){
    if(index - xscale[0] < 1 || !this.tickPreIndex){
      this.tickPreIndex = {
        pre: index,
        type: 'year'
      };
      if([7, 13, 20, 21, 22].indexOf(this.props.barConfig.type) > -1){
        ans = timeFormat("%Y-%m")(data[index].date);
      }else{
        ans = timeFormat("%m/%d")(data[index].date);
      }
    }else if(Math.ceil(index - xscale[0]) > showNum && index - this.tickPreIndex.pre >= showNum){
      if(parseInt(data[index].pdate / this.props.barConfig.divide) !== parseInt(data[this.tickPreIndex.pre].pdate / this.props.barConfig.divide) && this.tickPreIndex.type !== 'year'){
        this.tickPreIndex = {
          pre: index,
          type: 'year'
        };
        if([7, 13, 20, 21, 22].indexOf(this.props.barConfig.type) > -1){
          ans = timeFormat("%Y-%m")(data[index].date);
        }else{
          ans = timeFormat("%m/%d")(data[index].date);
        }
      }else if(data[index].pdate !== data[this.tickPreIndex.pre].pdate){
        this.tickPreIndex = {
          pre: index,
          type: 'month'
        };
        if([7, 13, 20, 21, 22].indexOf(this.props.barConfig.type) > -1){
          ans = timeFormat("%m")(data[index].date);
        }else{
          ans = timeFormat("%H:%M")(data[index].date);
        }
      }
    }
  }
  if(index === xscale[1]){
    this.tickPreIndex = null;
  }
  return ans;
}

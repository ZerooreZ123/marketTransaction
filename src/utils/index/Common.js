const _cloneDeep = require('lodash/cloneDeep');
const _maxBy = require('lodash/maxBy');
const _minBy = require('lodash/minBy');
const _sumBy = require('lodash/sumBy');

class Common {
  constructor(){
    this.__proto__.data = [];
    this.REF = this.REF.bind(this);
    this.SUM = this.SUM.bind(this);
  }

  init({data, flag}){
    /* ***************
     * 使用前的初始化, 判断是否需要更新数据对象
     * data: 具体数据
     * flag: 是否更新标志
     * **************/
    if(flag === true
      || flag === 1
      || this.data.length === 0
      || this.data.length !== data.length
    ){
      console.log('指标计算初始化检测到数据更新, 更新数据!, flag: ', flag);
      this.__proto__.data = _cloneDeep(data);
    }
    return this;
  }

  getData(){
    // 返回数据对象
    return this.data;
  }

  getSMAHandle({index, name, day, key, weight, type}){
    // 递归处理sma数据
    if(index === 0)this.data[index][name] = this.data[index][key];
    if(this.data[index][name] !== undefined)return this.data[index][name];
    if(type === 'EMA'){
      this.data[index][name] = (this.data[index][key] * weight + this.getSMAHandle({index: index - 1, name, day, key, weight}) * (day - 1)) / (day + 1);
    }else if(type === 'SMA'){
      this.data[index][name] = (this.data[index][key] * weight + this.getSMAHandle({index: index - 1, name, day, key, weight}) * (day - weight)) / day;
    }
    return this.data[index][name];
  }

  getSMA({key, day, weight, index=this.data.length - 1}){
    /* *************
     * 说明：返回移动平均
     * 用法：SMA(X,N,M),X的N日移动平均,M为权重,若Y=SMA(X,N,M)则Y=(X*M+Y'*(N-M))/N
     * !key: 计算SMA的key
     * !days: n日移动平均, 为数字或数字组成的数组
     *  weight: 权重
     *  index: 计算index之前的sma值
     * ************/
    return this.getSMAHandle({index, name: `${key}${day}`, day, key, weight, type: 'SMA'});
  }

  getEMA({key, day, index=this.data.length - 1}){
    /* **********
     * 说明：求指数移动平均
     * 用法：EMA(X,N),求X的N日指数平滑移动平均。若Y=EMA(X,N)则Y=[2*X+(N-1)*Y']/(N+1),其中Y'表示上一周期Y值
     * 例如：EMA(CLOSE,22)表示求22日指数平滑均价
     * 传参方式参考SMA_new方法
     * *********/
    return this.getSMAHandle({index, name: `${key}${day}`, day, key, weight: 2, type: 'EMA'});
  }

  getMA({key: X, day: N, index, start=this.MAX(0, index - N + 1)}){
    /* ****************
     * 说明：返回简单移动平均
     * 用法：MA(X,M),X的M日简单移动平均
     * ***************/
    let K = `MA-${X}-${N}`;
    if(this.data[index][K] !== undefined)return this.data[index][K];
    let tmpData = this.data.slice(start, index + 1);
    return this.data[index][K] = _sumBy(tmpData, X) / tmpData.length;
  }

  getHHV({key: X, day: N, index, start=this.MAX(0, index - N + 1)}){
    /* ****************
     * 说明：求最高值
     * 用法：HHV(X,N),求N周期内X最高值,N=0则从第一个有效值开始
     * 例如：HHV(HIGH,22),表示求22日最高价
     * ***************/
    let K = `HHV-${X}-${N}`;
    if(this.data[index][K] !== undefined)return this.data[index][K];
    return this.data[index][K] = _maxBy(this.data.slice(start, index + 1), X)[X];
  }

  getLLV({key: X, day: N, index, start=this.MAX(0, index - N + 1)}){
    /* ****************
     * 说明：求最低值
     * 用法：LLV(X,N),求N周期内X最低值,N=0则从第一个有效值开始
     * 例如：LLV(LOW,0),表示求历史最低价
     * ***************/
    let K = `LLV-${X}-${N}`;
    if(this.data[index][K] !== undefined)return this.data[index][K];
    return this.data[index][K] = _minBy(this.data.slice(start, index + 1), X)[X];
  }

  getSTD({key: X, day: N, index, start=this.MAX(0, index - N + 1)}){
    /* ****************
     * 说明：估算标准差
     * 用法：STD(X,N)为X的N日估算标准差
     * ***************/
    if(index < N - 1)return undefined;
    let K = `STD-${X}-${N}`;
    if(this.data[index][K] !== undefined)return this.data[index][K];
    //let start = this.MAX(0, index - N + 1)
    let tmp = this.SUM(X, N, index) / N
      , ans = 0;
    this.data.slice(start, index + 1).forEach(item => {
      ans += Math.pow(parseFloat(item[X]) - tmp, 2)
    })
    return this.data[K] = Math.sqrt(ans / (index - start));
  }

  // 传入数据中取较大值
  MAX = (...data) => Math.max(...data);

  // 传入数据中取较小值
  MIN = (...data) => Math.min(...data);

  // 取绝对值
  ABS = X => Math.abs(X);

  /* ****************
   * 说明：引用若干周期前的数据
   * 用法：REF(X,A),引用A周期前的X值
   * 例如：REF(CLOSE,1),表示上一周期的收盘价,在日线上表示昨收价
   * ***************/
  REF = (X, N, index, start=this.MAX(0, index - N)) => this.data[start][X];

  /* ****************
   * 说明：求总和
   * 用法：SUM(X,N),统计N周期中X的总和,N=0则从第一个有效值开始
   * 例如：SUM(VOL,0),表示统计从上市第一天以来的成交量总和
   * ***************/
  SUM = (X, N, index, start=this.MAX(0, index - N + 1)) => _sumBy(this.data.slice(start, index + 1), X);
}

module.exports = new Common();

import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { fitWidth, SaveChartAsImage } from "@/components/react-stockcharts/lib/helper";
import { ChartCanvas, Chart } from "@/components/react-stockcharts";
import { XAxis, YAxis } from "@/components/react-stockcharts/lib/axes";

import { discontinuousTimeScaleProvider } from "@/components/react-stockcharts/lib/scale";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "@/components/react-stockcharts/lib/coordinates";

import { interpolateNumber } from "d3-interpolate";
import { TrendLine, EquidistantChannel, DrawingObjectSelector } from "@/components/react-stockcharts/lib/interactive";
import { isNotDefined, isDefined, toObject, last } from "@/components/react-stockcharts/lib/utils";

import { toolConfig, reinstatementTypeConfig } from './klineConfig';
import { KeyCode } from './otherConfig';
import { CompBaseClass, MouseEventTool } from '@/utils/BaseTools.js';
import {connect} from 'react-redux';
import {transfromData} from '@/utils/FormatUtils';
import {KlineChartBar, getChartsByKX, getChartsByFS, autoTickFormat} from '@/components/lists/SubTools'
import {controller, pregendataby7, del, add} from '@/actions/';
import LoadOrigin from '@/components/lists/LoadOrigin';
import IndexSetting from '@/components/lists/SubTools/IndexSetting'
import CommonTooltip from '@/components/lists/SubTools/CommonTooltip'
import indexHandle from '@/utils/index/';
import { Resource } from '@/utils/resource';
import HighModal from '@/components/lists/HighModal';

import _cloneDeep from 'lodash/cloneDeep';
import _findLastIndex from 'lodash/findLastIndex';
import _max from 'lodash/max';
import _min from 'lodash/min';

const styleConfig = require('@/theme/')();


const {
  kMacdLabel,
  kMacdDif,
  kMacdDea,
  kLineUnder: highColor,
  kLineUpper: lowColor,
  kLineUnder2: highColor2,
  kLineUpper2: lowColor2,
  klinePing: klinePing,
  kLineMidVol: textColor,
  kLineVolx: volColorx,
  kLineVoly: volColory,
  kAvgLineColor5: kAvgLineColor5,
  kAvgLineColor10: kAvgLineColor10,
  kAvgLineColor20: kAvgLineColor20,
  kAvgLineColor60: kAvgLineColor60,
  "border-color-base": indDivColor,
  "background-color-plate": bgColor
} = styleConfig;

class DetailChartOrigin extends CompBaseClass {
  constructor(props){
    super(props);
    this.init = this.init.bind(this);
    this.saveNode = this.saveNode.bind(this);
    this.emitSocketRequest = this.emitSocketRequest.bind(this);
    this.saveInteractiveNodes = this.saveInteractiveNodes.bind(this);
    this.getInteractiveNodes = this.getInteractiveNodes.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.zoom = this.zoom.bind(this);
    this.state = {
      selectDrawType: '',
      showByIndLine: this.props.showByIndLine || [],
      showByIndChart: this.props.showByIndChart || [],
      reinstatementType: this.props.reinstatementType || reinstatementTypeConfig.default,
    }
    this.init(props);
    this.getChartsByKX = getChartsByKX.bind(this);
    this.getChartsByFS = getChartsByFS.bind(this);
    this.autoTickFormat = autoTickFormat.bind(this);
    this.reinstatementChangeHandle = this.reinstatementChangeHandle.bind(this);
    this.keydownHandle = this.keydownHandle.bind(this);
    this.goDetailPage = this.goDetailPage.bind(this);
    this.props.myref && this.props.myref(this);
    this.zooming = false;
    this.commonTipHeight = 25;
    this.barHeight = props.barHeight || 36;
    this.tickHeight = 25;
    this.mouseOnChart = false;
    this.saveChartToPng = this.saveChartToPng.bind(this);
  }

  goDetailPage(){
    try{
      let stockInfo = _cloneDeep(window.codelist.data[this.symbol]);
      this.props.barConfig.name === 'DAY' && (stockInfo.activeIndex = 1);
      this.props.controller({isShowQuoteDetails: true, quoteDetailsData: stockInfo});
    }catch(err){
      console.log('进入详情页失败: ', err);
    }
  }

  init(props){
    // 初始化
    [this.symbol, this.dataType] = props.actionName.split('-');
    this.stockInfo = window.codelist.data[this.symbol];
    if((this.dataType === '7' || props.isFirst) && !props.data[`${this.symbol}-7`]){
      // 当第一次并且dataType为7的数据不存在时执行
      props.pregendataby7({actionName: `${this.symbol}-7`});
    }
    this.subChartHeight = props.height / (this.state.showByIndChart.length + 1.618) - 20;
    this.defaultOneWidth = 12;
    this.defaultLabelWidth = 60;
    this.defaultPadding = this.dataType === '7'? 4: this.defaultOneWidth / 2 + 5;
    this.activeWidth = props.width - (this.defaultLabelWidth + this.defaultPadding) * 2;
    this.showNum = parseInt(this.activeWidth / this.defaultOneWidth);
    if(props.data[props.actionName] && props.data[props.actionName].length < this.showNum){
      this.activeWidth = props.data[props.actionName].length * this.defaultOneWidth;
      //this.activeWidth = (props.width - 60 * 2) * (props.data[props.actionName].length / this.showNum) + 105;
      //this.showNum = props.data[props.actionName].length;
    }
  }

  contextMenuHandle(info, event){
    // 图表右击事件
    console.log('图表右击');
  }

  reinstatementChangeHandle(value){
    // 复权因子变更操作
    let tmp0, tmp1, tmp2, self = this;
    if((tmp0 = window.codelist.data) && (tmp1 = tmp0[this.symbol]) && (tmp2 = tmp1.reinstatementData)){
      this.setState({reinstatementType: value, reinstatementData: tmp2});
    }else{
      !tmp0 && (tmp0 = window.codelist.data = {});
      !tmp1 && (tmp1 = tmp0[this.symbol] = {});
      const [exchange, stockCode] = this.symbol.split('.');
      Resource.getReinstatement.post('', '', `/${exchange}/${stockCode}`).then((data) => {
        tmp1.reinstatementData = data;
        self.setState({reinstatementType: value, reinstatementData: data});
      }).catch(err => {
        // throw new Error(err);
      });

    }
  }

  componentWillMount() {
    if(this.props.isFirst){
      // 第一次时预加载所有数据
      this.props.cycleBarConfig.forEach(item => {
        this.emitSocketRequest({type: 'sub', action: [this.symbol, item.type]});
      })
    }else{
      this.emitSocketRequest({type: 'sub', action: [this.symbol, this.dataType]});
    }
  }

  componentDidMount() {
    // 当为小图并且非分时图时执行复权相关操作
    !(this.props.chartSize === 'small' && this.dataType === '7') && this.reinstatementChangeHandle(this.state.reinstatementType);
    if(this.props.isFirst){
      this.props.cycleBarConfig.forEach(item => {
        if(item.type !== this.props.barConfig.type){
          setTimeout(_ => {
            this.emitSocketRequest({type: 'unsub', action: [this.symbol, item.type]});
          }, 50)
        }
      })
    }else{
      this.emitSocketRequest({type: 'sub', action: this.props.actionName.split('-'), start: 1});
    }
    document.addEventListener('keydown', this.keydownHandle);
  }

  componentWillUnmount() {
    this.emitSocketRequest({type: 'unmount', action: this.props.actionName.split('-')});
    document.removeEventListener('keydown', this.keydownHandle);
  }

  keydownHandle(e) {
    //e.preventDefault();
    //e.stopPropagation()
    if(!(this.node && this.node.mouseOnChart))return;
    switch (e.keyCode) {
      case KeyCode.UP:
        window.canKeyBoard && this.zoom(1);
        break;
      case KeyCode.DOWN:
        window.canKeyBoard && this.zoom(-1);
        break;
      case KeyCode.LEFT:
        //console.log('左键移动十字线')
        this.node.mouseMoveNext(e);
        break;
      case KeyCode.RIGHT:
        //console.log('右键移动十字线')
        this.node.mouseMovePrev(e);
        break;
      default:
    }
  }

  saveChartToPng(){
    const container = ReactDOM.findDOMNode(this.node);
    SaveChartAsImage.saveChartAsImage(container, bgColor);
  }

  emitSocketRequest({type, action, order, start}){
    // type为sub时发起订阅, unsub时取消订阅
    // 注意：start为1表示不返回历史数据, order表示定位窜
    let symbol, dataType, tmp;
    if(type === 'sub'){
      [symbol, dataType] = action;
      if(dataType === 7){
        this.emitEvent([{symbol, dataType}], 1);
      }else{
        tmp = {symbol, dataType, length: Math.max(parseInt(this.showNum * 2), 300), order: order === undefined? '': order};
        if(start)tmp.start = start;
        this.emitEvent([tmp], 1);
      }
    }else if(type === 'unsub'){
      [symbol, dataType] = action;
      this.unemitEvent(`${symbol}-${dataType}`);
    }else if(type === 'unmount'){
      this.unemitEvent();
    }
  }

  saveNode(key, node){
    this[key] = node;
  }

  componentWillReceiveProps(nextProps){
    this.init(nextProps);
    if(this.props.data[this.props.actionName] && nextProps.data[this.props.actionName].length !== this.props.data[this.props.actionName].length && this.zoomer){
      let diff = nextProps.data[this.props.actionName].length - this.props.data[this.props.actionName].length - 1;
      this.zoomer[0] += diff;
      this.zoomer[1] += diff;
    }
    if(nextProps.width !== this.props.width || nextProps.height !== this.props.height){
    }
    if(nextProps.actionName !== this.props.actionName){
      this.isRenderByData = true;
      this.emitSocketRequest({type: 'unsub', action: this.props.actionName.split('-')});
      this.emitSocketRequest({type: 'sub', action: nextProps.actionName.split('-')});
    }
  }


  zoom(direction) {
    // 控制缩放
    if(this.props.chartSize === 'small' || this.zooming || this.props.data[this.props.actionName].length < this.showNum || this.dataType === '7')return;
    this.zooming = true;
    const { xAxisZoom, xScale, plotData, xAccessor } = this.node.getChildContext();
    const cx = xScale(xAccessor(last(plotData)));
    // mean(xScale.range());
    const { zoomMultiplier } = this.node.props;

    const c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

    const [start, end] = xScale.domain();
    const [newStart, newEnd] = xScale.range()
      .map(x => cx + (x - cx) * c)
      .map(xScale.invert);

    const left = interpolateNumber(start, newStart);
    const right = interpolateNumber(end, newEnd);

    const foo = [0.25, 0.3, 0.5, 0.6, 0.75, 1].map(i => {
      return [left(i), right(i)];
    });
    if(foo[foo.length - 1][0] < this.showNum){
      this.zoomer = foo[foo.length - 1];
      this.emitSocketRequest({type: 'sub', action: this.props.actionName.split('-'), order: this.props.data[this.props.actionName].order});
    }

    this.interval = setInterval(() => {
      xAxisZoom(foo.shift());
      if (foo.length === 0) {
        this.zooming = false;
        clearInterval(this.interval);
        delete this.interval;
      }
    }, 10);
  }

  onClickHandle({e, compType, drawType}){
    // 划线工具点击事件
    let state = _cloneDeep(this.state);
    switch(compType){
      case 'TrendLine':
        state.enable[compType] = true;
        state.type[compType] = drawType;
        state.selectDrawType = drawType || '';
        break;
      case 'DeleteItem':
        Object.keys(state.data).forEach(each => {
          state.data[each] = state.data[each].filter(item => !item.selected)
        });
        this.node.cancelDrag();
        break;
      case 'DeleteAll':
        this.node.cancelDrag();
        Object.keys(state.data).forEach(each => state.data[each] = []);
        break;
    }
    this.setState(state);
  }


  onDrawComplete(type, data){
    this.setState(prev => {
      prev.data[type] = data;
      prev.enable[type] = false;
      prev.selectDrawType = '';
      return prev;
    })
  }

  handleSelection(interactives){
    this.setState(prev => {
      prev.data = {...prev.data, ...toObject(interactives, each => {
        return [
          each.type,
          each.objects,
        ];
      })};
      return prev;
    })
  }

  saveInteractiveNodes(type, chartId) {
    // 划线工具所画线的对象
    return node => {
      if (isNotDefined(this.interactiveNodes)) {
        this.interactiveNodes = {};
      }
      const key = `${type}_${chartId}`;
      if (isDefined(node) || isDefined(this.interactiveNodes[key])) {
        this.interactiveNodes = {
          ...this.interactiveNodes,
          [key]: { type, chartId, node },
        };
      }
    };
  }

  getInteractiveNodes() {
    return this.interactiveNodes;
  }

  getDrawLine(){
    // 画线工具-线条
    return (
      <TrendLine
        ref={this.saveInteractiveNodes("Trendline", 1)}
        enabled={this.state.enable.TrendLine}
        type={this.state.type.TrendLine}
        onStart={() => console.log("START")}
        trends={this.state.data.TrendLine}
        onComplete={trends => this.onDrawComplete('TrendLine', trends)}
        appearance={{
          stroke: '#a76b23',
          edgeFill: 'blue'
        }}
      />
    )
  }
  // kLineVolx:volColorx,kLineVoly:volColory
  getAxisStyle(dire){
    // 生成多次使用的y轴显示样式魔板
    return {
      zoomEnabled: false,
      axisAt: dire,
      orient: dire,
      tickStroke: volColorx,
      tickStrokeDasharray: "Dash",
      tickStrokeOpacity: 0.1,
      tickLineStrokeOpacity: 0.08,
      stroke: "rgba(0,0,0,0)"
    }
  }

  getAxisCoorY(dire){
    // 生成多次使用的y轴边缘鼠标互动样式魔板
    return {
      at: dire,
      orient: dire,
      stroke: '#3174ed',
      opacity: 1,
      fill: '#191b31',
      arrowWidth: 0,
      displayFormat: data => isNaN(data) || data === undefined? '--': transfromData({data, uuid: this.symbol, info: {}})
    }
  }

  getTickStroke(index, middIndex){
    if(index === middIndex){
      return textColor;
    }else{
      return index > middIndex? highColor: lowColor;
    }
  }


  tickPreIndex = null

  isLimit(data, opacity=false){
    if(data.close === data.open){// && data.high === data.low && data.high === data.close && data.open === data.low){
      return klinePing;
    }else{
      return data.close < data.open ? lowColor2 : (opacity? "rgba(0, 0, 0, 0)": highColor2);
    }
  }

  getReinstatement(data){
    // 获取复权数据
    let reinstatementType = this.state.reinstatementType
      , reinstatementData = _cloneDeep(this.state.reinstatementData);
    if(!reinstatementType || reinstatementType === 'not')return data;
    if(reinstatementType === 'front'){
      data = data.reverse();
    }else if(reinstatementType === 'back'){
      reinstatementData = reinstatementData.reverse();
    }
    let reinstatement, reinstatementKey;
    data.map(item => {
      try{
        if(reinstatementType === 'back' && reinstatementData.length > 0 && item.dated > parseInt(reinstatementData[0].EX_RD_DT)){
          reinstatement = reinstatementData.shift();
          reinstatementKey = 'BK_IER';
        }
        if(reinstatementType === 'front' && reinstatementData.length > 0 && item.dated < parseInt(reinstatementData[0].EX_RD_DT)){
          reinstatement = reinstatementData.shift();
          reinstatementKey = 'EX_IER';
        }
        if(reinstatement){
            ['close', 'open', 'high', 'low', 'preClose'].forEach(key => item[key] *= reinstatement[reinstatementKey]);
        }
      } catch(err){
        debugger;
      }
    })
    if(reinstatementType === 'front'){
      return data.reverse();
    }else if(reinstatementType === 'back'){
      return data;
    }
  }

  dataHandle(showData){
    // 对相应指标计算所需数据
    const {showByIndChart, showByIndLine} = this.state;
    let maxData = ['high'], minData = ['low'], parseFuncs = [];
    let indexOtherConfig = {}, tmpData, tmp;
    this.dataType === '7' && (indexOtherConfig.close = 'price');
    showByIndChart.forEach(item => {
      // 基于独立chart的指标显示
      item.options && (tmp = {...indexOtherConfig, ...item.options});
      if(item.type){
        indexHandle({flag: this.isRenderByData, name: item.type, data: showData, ...tmp});
        this.isRenderByData = false;
      }
    });
    showByIndLine.forEach(item => {
      // 在主图表加线条显示
      item.options && (tmp = {...indexOtherConfig, ...item.options});
      indexHandle({flag: this.isRenderByData, name: item.type, data: showData, ...tmp});
      this.isRenderByData = false;
      item.tipConfig.configs.forEach(({key, color}) => {
        maxData.push(key);
        minData.push(key);
      });
    });
    showData.map(data => {
      parseFuncs.forEach(func => func(data));
      data.maxPrice = _max(Array.from(maxData, key => data[key]));
      data.minPrice = _min(Array.from(minData, key => data[key]));
    })
  }

  mouseleaveHandle = () => {
    this.mouseOnChart = false;
  }

  mouseenterHandle = () => {
    this.mouseOnChart = true;
  }

  render() {
    const {showByIndChart, showByIndLine, selectDrawType} = this.state;
    // 当只有一个指标时显示2/5
    const {hasChartBar, barConfig} = this.props;
    let showData, self = this, tmp;
    showData = _cloneDeep(this.props.data[this.props.actionName]);
    if(!this.isLegal(showData)){
      return <LoadOrigin type={showData && showData.length === 0? 'nomore': ''}/>;
    }
    this.rendered = true;
    if(this.props.hasReinstatement && this.state.reinstatementData){
      // 复权计算
      showData = this.getReinstatement(showData);
    }
    this.init(this.props);

    this.dataHandle(showData);
    if(this.dataType !== '7' && this.props.chartSize === 'small'){
      // 只显示一屏幕的数据
      showData.splice(0, showData.length - this.showNum);
    }
    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date);
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(showData);
    let chartCanvasConfig = {
      mainChartHeight: this.props.height - this.barHeight - this.tickHeight,
      height: this.props.height,// - (this.props.chartSize === 'big'? 28: 0),
      ratio: this.props.ratio,
      width: this.props.width,
      type: this.props.type,
      data,
      seriesName: "MSFT",
      clamp: true,
      //margin: { left: 60, right: 60, top: 10, bottom: 25 },
      margin: {
        left: this.defaultLabelWidth,
        right: this.props.width - this.activeWidth - this.defaultLabelWidth - this.defaultPadding * 2,
        top: this.barHeight,
        bottom: this.tickHeight
      },
      xScale,
      xAccessor,
      displayXAccessor,
      zoomEvent: this.props.zoomEvent,
      panEvent: this.props.panEvent,
      padding: this.defaultPadding,
      mouseleaveHandle: this.mouseleaveHandle,
      mouseenterHandle: this.mouseenterHandle,
    }
    if(this.dataType === '7'){
      chartCanvasConfig.panEvent = false;
      chartCanvasConfig.xExtents = [xAccessor(last(data)), xAccessor(data[0])];
    }else{
      if(this.zoomer){
        chartCanvasConfig.xExtents = this.zoomer;
      }else{
        chartCanvasConfig.xExtents = [xAccessor(last(data)) || 1, xAccessor(data[data.length - this.showNum] || 0)];
      }
      if(data.length < this.showNum){
        chartCanvasConfig.panEvent = false;
      }
      //chartCanvasConfig.margin.top = 36;
    }
    if(this.props.chartSize === 'small'){
      chartCanvasConfig.onDoubleClick = this.goDetailPage;
    }
    let XAxisTickValue;
    if (chartCanvasConfig.width < 500) {
      XAxisTickValue = [0, 121, 241];
    } else if (chartCanvasConfig.width < 900) {
      XAxisTickValue = [0, 60, 121, 181, 241];
    } else {
      XAxisTickValue = [0, 30, 60, 90, 121, 151, 181, 211, 241];
    }

    console.log('detailChart渲染次数:', this.compId, this.renderTime, '位置: ', window.superMonitor[self.props.actionName].indexAt);//, data[window.superMonitor[self.props.actionName].indexAt || data.length - 1]);

    return (
      <div
        className="klineBox"
        id={this.compId}
        data-actionname={this.props.actionName}
        //style={{paddingTop: this.dataType === '7' && this.props.chartSize === 'big'? '26px': '0'}}
        tabIndex='-1'
      >
        <IndexSetting
          setRef={node => this.saveNode('highModalNode', node)}
          title={config => `指标设置(${config.title})`}
          parentNode={this}
        >
        </IndexSetting>
        <ChartCanvas
          ref={node => node && this.saveNode('node', node)}
          {...chartCanvasConfig}
        >
          {
            this.dataType === '7'?
              this.getChartsByFS({chartCanvasConfig, XAxisTickValue}):
              this.getChartsByKX({chartCanvasConfig})
          }
          {
            showByIndChart.map((item, index) => {
              let Series = item.series, yTickValues = data => [0, data[1]];
              if(this.isLegal(item.yTickValues)){
                yTickValues = item.yTickValues;
              }
              return (
                <Chart
                  id={`${this.compId}-ind-${item.title}-${index}`}
                  key={`${this.compId}-ind-${item.title}-${index}`}
                  height={this.subChartHeight - this.commonTipHeight}
                  origin={(w, h) => [0, h - (showByIndChart.length - index) * this.subChartHeight + this.commonTipHeight]}
                  yExtents={data => item.yExtentsFun(data)}
                >
                  <Series yAccessor={d => d} appearance={item.tipConfig.configs} />
                  <CommonTooltip
                    defaultData={self.dataType === '7'? showData[window.superMonitor[self.props.actionName].indexAt]: showData[showData.length - 1]}
                    origin={[0, -2]}
                    indexInfo={item}
                    chartCanvasConfig={chartCanvasConfig}
                    divStyle={{
                      stroke: kMacdLabel,
                      strokeWidth: '0.6',
                      opacity: '0.2',
                    }}
                    dot={(tmp = window.codelist.data[this.symbol], tmp) && tmp.digit || 2}
                    parentNode={this}
                    boxHeight={this.commonTipHeight}
                  />
                  <YAxis
                    ticks={3}
                    tickValues={yTickValues}
                    {...this.getAxisStyle('right')}
                    tickFormat={data => transfromData({data, uuid: this.symbol, info: {isNum: item.isNum}})}
                    axisAt={this.props.width - 60 * 2}
                  />
                  <YAxis
                    ticks={3}
                    tickValues={yTickValues}
                    {...this.getAxisStyle('left')}
                    tickFormat={data => transfromData({data, uuid: this.symbol, info: {isNum: item.isNum}})}
                  />
                  <MouseCoordinateY
                    {...this.getAxisCoorY('left')}
                    displayFormat={data => transfromData({data, uuid: this.symbol, info: {isNum: item.isNum}})}
                  />
                  <MouseCoordinateY
                    {...this.getAxisCoorY('right')}
                    displayFormat={data => transfromData({data, uuid: this.symbol, info: {isNum: item.isNum}})}
                  />
                  {
                    // 分时情况X轴显示
                    index + 1 === showByIndChart.length && this.dataType === '7' && (
                      <XAxis
                        innerTickSize={-1 * chartCanvasConfig.mainChartHeight}
                        //innerTickSize={-200}
                        ticks={9}
                        tickFormat={d => timeFormat("%H:%M")(data[d].date)}
                        {...this.getAxisStyle('bottom')}
                        tickValues={XAxisTickValue}
                        tickStroke={volColorx}
                        zoomEnabled={false}
                      />
                    )
                  }
                  {
                    // K线情况X轴显示
                    index + 1 === showByIndChart.length && this.dataType !== '7' && (
                      <XAxis
                        innerTickSize={-1 * chartCanvasConfig.mainChartHeight}
                        ticks={data.length}
                        tickFormat={index => this.autoTickFormat(data, index, chartCanvasConfig.width - 60 * 2)}
                        {...this.getAxisStyle('bottom')}
                      />
                    )
                  }
                  {
                    index + 1 === showByIndChart.length && (
                      <MouseCoordinateX
                        {...this.getAxisCoorY('bottom')}
                        displayFormat={timeFormat(barConfig.format)}
                      />
                    )
                  }
                </Chart>
              )
            })
          }
          <CrossHairCursor stroke="#3174ed" opacity={1}/>
        </ChartCanvas>
      </div>
    );
  }
}
DetailChartOrigin.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
  hasTipPanel: PropTypes.bool.isRequired,
  panEvent: PropTypes.bool.isRequired,
  zoomEvent: PropTypes.bool.isRequired,
  chartSize: PropTypes.oneOf(["small", "big"]).isRequired,
  quoteInfo: PropTypes.object.isRequired,
  hasReinstatement: PropTypes.bool,
  klineBarProps: PropTypes.object,
};

DetailChartOrigin.defaultProps = {
  type: "hybrid",
  ratio: 1,
  hasTipPanel: false,
  panEvent: false,
  zoomEvent: false,
  chartSize: 'small',
  hasReinstatement: false,
  klineBarProps: {},
};

export default connect(
  state => ({
    data: state.Data,
  }), {controller, del, add, pregendataby7}
)(fitWidth(DetailChartOrigin));

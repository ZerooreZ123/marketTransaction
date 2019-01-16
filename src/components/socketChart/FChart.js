import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "../react-stockcharts";
import {
  BarSeries,
  AreaSeries,
  CandlestickSeries,
  LineSeries
} from "../react-stockcharts/lib/series";
import { XAxis, YAxis } from "../react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY
} from "../react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "../react-stockcharts/lib/scale";
import {
  OHLCTooltip,
  MovingAverageTooltip
} from "../react-stockcharts/lib/tooltip";
import { ema, heikinAshi, sma } from "../react-stockcharts/lib/indicator";
import { fitWidth } from "../react-stockcharts/lib/helper";
import { last } from "../react-stockcharts/lib/utils";
import {
	PriceCoordinate
} from "@/components/react-stockcharts/lib/coordinates";
import CalcWidthAndHeight from "@/components/highOrder/CalcWidthAndHeight";

import _maxBy from 'lodash/maxBy';
import _minBy from 'lodash/minBy';

const styleConfig = require('@/theme/')();
const {kLineUnder: highColor, kLineUpper: lowColor} = styleConfig;


const textColor = '#d8dfeb', lineColor = '#5faaf5';

class HeikinAshi extends React.Component {

  getLimitValue(data, rightKey='netChangeRatio', leftKey='price', bottomKey='nowVolume'){
    // debugger
    /* *******************
     * 依次返回右侧坐标轴显示数据, 右侧范围数据, 左侧坐标轴显示数组, 左侧返回数组, 下方柱状图最大值
     * ******************/
    const middNum = 1;
    const [maxItem, minItem] = [_maxBy(data, rightKey), _minBy(data, rightKey)];
    if(!maxItem)return false;
    // const ratio = (maxItem[leftKey] - minItem[leftKey]) / (maxItem[rightKey] - minItem[rightKey]);
    let maxAbsRatio = Math.max(maxItem[rightKey], Math.abs(minItem[rightKey]));
    let ans_posi = [], ans_nega = [], ans, res = [], bottomMax;
    for(var i = 1, da = maxAbsRatio / middNum; i <= middNum; i++){
      ans_posi.push(da * i);
      ans_nega.push(-da * (middNum + 1 - i));
    }
    ans = [...ans_nega, 0, ...ans_posi];
    res = Array.from(ans, item => maxItem[leftKey] - maxItem[leftKey] * (maxItem[rightKey] - item) / 100);
    bottomKey && (bottomMax = _maxBy(data, bottomKey)[bottomKey]);
    let hifAnsOne = (ans[middNum + 1] - ans[middNum]) / 2, hifResOne = (res[middNum + 1] - res[middNum]) / 2;
    return [ans, [-maxAbsRatio - hifAnsOne, maxAbsRatio + hifAnsOne], res, [res[0] - hifResOne, res[res.length - 1] + hifResOne], bottomMax, middNum];
  }

  getTickStroke(index, middIndex){
    if(index === middIndex){
      return textColor;
    }else{
      return index > middIndex? highColor: lowColor;
    }
  }

  render() {
    const ha = heikinAshi();
    const ema20 = ema()
      .id(0)
      .options({ windowSize: 20 })
      .merge((d, c) => {
        d.ema20 = c;
      })
      .accessor(d => d.ema20);

    const ema50 = ema()
      .id(2)
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor(d => d.ema50);

    const smaVolume50 = sma()
      .id(3)
      .options({ windowSize: 50, sourcePath: "nowVolume" })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor(d => d.smaVolume50);

    const { type, data: initialData, width, ratio ,height, priceArr ,netChangeRatioArr,nowVolumeArr} = this.props;
    const calculatedData = smaVolume50(ema50(ema20(ha(initialData))));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length-150)]);
    const xExtents = [start, 0];


    let tickValues = [], maxValue = [], _tickValues = [], _maxValue = [], barMaxValue = 0, middIndex, temp;
    !this.props.isFirst && (temp = this.getLimitValue(data), temp) && ([tickValues, maxValue, _tickValues, _maxValue, barMaxValue, middIndex] = temp);
    // let chartWidth = width - margin.left - margin.right;
    // this.getLimitValue(data)


    return (
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={{ left: 65, right: 65, top: 0, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        mouseMoveEvent={true}
        panEvent={false}
        zoomEvent={false}
        clamp={false}
      >
        <Chart
          id={3}
          height={height*2/3}
          yExtents={maxValue}
          padding={{ top: 5, bottom: 5 }}
        >
          <YAxis
            ticks={3}
            fontSize={10}
            tickValues={tickValues}
            stroke="#d8dfeb"
            opacity="0.1"
            tickStroke={index => this.getTickStroke(index, middIndex)}
            axisAt="right" orient="right"  zoomEnabled = {false} tickFormat={value => format('.2f')(value) + ' %'}/>
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={value => format('.2f')(value) + ' %'}
            stroke={'#3174ed'}
            opacity={1}
            fill= {'#191b31'}
            fontSize={10}
            arrowWidth={0}
          />

           <AreaSeries yAccessor={d => d.netChangeRatio} stroke={'#61a9f0'} opacity={0.3} 
          fill="#1d2c53"
          />
        </Chart>
        <Chart
          id={1}
          height={height*2/3}
          yExtents={_maxValue}
          padding={{ top: 5, bottom:5 }}
        >
          <YAxis
            fontSize={10}
            tickValues={_tickValues}
            ticks={3}
            stroke="#d8dfeb"
            opacity="0.1"
            axisAt="left"
            orient="left"  zoomEnabled = {false} 
            tickFormat={format(".2f") }
            innerTickSize={-1 * (width - 130)}
            tickStrokeDasharray= "Dash"
            tickStrokeOpacity= {0.1}
            tickLineStrokeOpacity={index => index === middIndex? 0.6: 0.2}
            tickStroke={index => this.getTickStroke(index, middIndex)}
            />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".2f")}
            stroke={'#3174ed'}
            opacity={1}
            fill= {'#191b31'}
            fontSize={10}
            arrowWidth={0}
          />
          <CurrentCoordinate yAccessor={d => d.price} fill={ema20.stroke()} />
          <CurrentCoordinate yAccessor={d => d.avgprice} fill={ema50.stroke()}/>
        </Chart>
        <Chart
          id={2}
          yExtents={[d => d.nowVolume]}
          height={height/6}
          origin={(w, h) => [0, h - height/6]}
        >
          <XAxis axisAt="bottom"
           stroke="#d8dfeb"
           opacity="0.1"
           orient="bottom"
           zoomEnabled = {false}
           tickStroke="#d8dfeb"
           ticks={5}
           fontSize={10}
           tickFormat={d => timeFormat("%H:%M")(data[d].date)}
           tickValues={[0, 61, 121, 181, 241]}
          />
          <YAxis
            tickStroke="#d8dfeb"
            stroke="#d8dfeb"
            opacity="0.1"
            axisAt="left"
            orient="left"
            fontSize={10}
            ticks={2}
            tickValues={[0, barMaxValue]}
            zoomEnabled = {false}
             innerTickSize={ -1 * (width -130)}
            tickStrokeDasharray ={'Solid'}
            tickStrokeOpacity = {1}
            tickStrokeWidth={1}
            tickFormat={value => (value = value > 100000 ? format(".2f")(value/10000) + '万' :format(".2f")(value)) }
          />
          <YAxis
           tickValues={[0, barMaxValue]}
            tickStroke="#d8dfeb"
            stroke="#d8dfeb"
           opacity="0.1"
            fontSize={10}
            axisAt="right"
            orient="right"
            ticks={1}
            zoomEnabled = {false}
            tickFormat={value => (value = value > 100000 ? format(".2f")(value/10000) + '万' :format(".2f")(value)) }
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%H:%M")}
            fontSize={10}
            stroke={'#3174ed'}
            opacity={1}
            fill= {'#191b31'}
            arrowWidth={0}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".2f")}
            stroke={'#3174ed'}
            opacity={1}
            fill= {'#191b31'}
            fontSize={10}
            arrowWidth={0}
          />

          <BarSeries
            yAccessor={d => d.nowVolume}
            opacity={1}
            fill={d => (d.bprice > d.price ? "#2ec87b" : "#ff2b48")}
          />
        </Chart>

        <CrossHairCursor stroke="#3174ed" opacity={1}/>
      </ChartCanvas>
    );
  }
}

HeikinAshi.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

HeikinAshi.defaultProps = {
  type: "hybrid",
  ratio: 1
};

HeikinAshi = fitWidth(HeikinAshi);

export default HeikinAshi;

import React, { Component } from 'react';
import { ChartCanvas, Chart } from "@/components/react-stockcharts";
import {
  LineSeries,
  BarSeries,
  CandlestickSeries,
} from "@/components/react-stockcharts/lib/series";
import { XAxis, YAxis } from "@/components/react-stockcharts/lib/axes";
import { discontinuousTimeScaleProvider } from "@/components/react-stockcharts/lib/scale";
import {
  OHLCTooltip,
  HoverTooltip
} from "@/components/react-stockcharts/lib/tooltip";
import {
  MouseCoordinateX,
  MouseCoordinateY,
  CurrentCoordinate,
} from "@/components/react-stockcharts/lib/coordinates";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { transfromData } from '@/utils/FormatUtils';
import { ema } from "@/components/react-stockcharts/lib/indicator";
import { getLimitValueBySmallKline } from './';
import {
  Annotate,
  SvgHighOrLowAnnotation,
  highPath,
  lowPath
} from '@/components/react-stockcharts/lib/annotation';
import _maxBy from "lodash/maxBy";
import _minBy from "lodash/minBy";
import {DrawLine, KlineBar} from '@/components/lists/SubTools'
const styleConfig = require('@/theme/')();

const { kLineUnder: highColor,
  kLineUpper: lowColor,
  kLineUnder2: highColor2,
  kLineUpper2: lowColor2,
  kLineMidVol: textColor,
  kLineVolx: volColorx,
  kLineVoly: volColory,
  'font-color-base': fontColor
} = styleConfig;


export function getChartsByKX({chartCanvasConfig}) {
  // K线类型主图表
  const { barConfig, klineBarProps } = this.props;
  let { data, width, height, margin, xScale } = chartCanvasConfig;
  let tickValues = [], tmp;
  const { showByIndChart, showByIndLine } = this.state;
  let chartWidth = width - margin.left - margin.right;
  let chartHeight = height - margin.top - margin.bottom;
  let mainChartHeight = chartHeight - showByIndChart.length * this.subChartHeight;

  let mainValue, barValue, barYAxisProps = {}, XAxisProps = {}, mainYAxisProps = {};
  [mainValue, barValue] = getLimitValueBySmallKline({ data, middNum: this.props.axisNumY });
  if (this.props.chartSize === 'small') {
    barYAxisProps.tickValues = [0, barValue];
    if (data.length < 6) {
      XAxisProps.tickValues = [0];
    } else if (data.length < this.showNum * 4 / 5) {
      XAxisProps.tickValues = [0, data.length - 1];
    } else {
      XAxisProps.tickValues = [0, parseInt(data.length / 2), data.length - 1];
    }
    XAxisProps.tickFormat = index => timeFormat("%Y-%m-%d")(data[index].date);
    XAxisProps.ticks = XAxisProps.tickValues.length;
    mainYAxisProps.tickValues = mainValue;
    mainYAxisProps.ticks = mainValue.length;
  } else if (this.props.chartSize === 'big') {
    barYAxisProps.tickValues = limit => [limit[0], (limit[1] - limit[0]) / 2, limit[1]];
    XAxisProps.tickFormat = index => this.autoTickFormat(data, index, width - 60 * 2);
    XAxisProps.ticks = data.length;
    mainYAxisProps.ticks = 5;
  }
  volColory && (barYAxisProps.tickStroke = volColory);
  volColorx && (XAxisProps.tickStroke = volColorx);

  data.forEach((item, index, ans) => {
    if (index === 0 || (index > 0 && ans[index - 1].pdate !== ans[index].pdate)) {
      tickValues.push(index);
      if (index === 0 || parseInt(ans[index - 1].pdate / 100) !== parseInt(ans[index].pdate / 100)) {
        item.isHead = true;
      }
    }
  })
  let mainChart = (
    <Chart
      id={this.compId + '-main'}
      key={this.compId + '-main'}
      yExtents={d => [d.maxPrice, d.minPrice]}
      height={mainChartHeight}
      onContextMenu={this.contextMenuHandle}
    >
      <KlineBar
        onZoom={arg => this.zoom(arg)}
        onClickHandle={args => this.onClickHandle(args)}
        saveChartToPng={this.saveChartToPng}
        parentNode={this}
        dot={(tmp = window.codelist.data[this.symbol], tmp) && tmp.digit || 2}
        config={barConfig}
        newData={data[data.length - 1]}
        chartCanvasConfig={chartCanvasConfig}
        barHeight={this.barHeight}
        showByIndLine={showByIndLine}
        barConfig={barConfig}
        stockInfo={this.stockInfo}
        {...klineBarProps}
      >
      </KlineBar>
      <YAxis
        innerTickSize={-1 * chartWidth}
        {...this.getAxisStyle('left')}
        {...mainYAxisProps}
        tickFormat={data => transfromData({data, uuid: this.symbol})}
      />
      <YAxis
        innerTickSize={-1 * chartWidth}
        {...this.getAxisStyle('right')}
        {...mainYAxisProps}
        axisAt={width - 60 * 2}
        tickFormat={data => transfromData({data, uuid: this.symbol})}
      />
      <OHLCTooltip
        mousemoveHandle={data => this.getMainDataTips && this.getMainDataTips.setState({ data })}
      />
      {
        showByIndChart.length === 0 && (
          <XAxis
            innerTickSize={-1 * chartCanvasConfig.mainChartHeight}
            isEnd={_ => !this.isLegal(this.tickPreIndex)}
            {...this.getAxisStyle('bottom')}
            {...XAxisProps}
          />
        )
      }
      {
        this.props.hasTipPanel &&
        <HoverTooltip
          bgFill={'#1c243c'}
          fill={'#1c243c'}
          fontFill='#ccc'
          fontSize={window.baseFontSize * 0.16}
          tooltipContent={({ currentItem, xAccessor }) => {
            return {
              x: timeFormat(barConfig.panelFormat)(xAccessor(currentItem)),
              y: [{
                label: "涨跌幅",
                value: currentItem.netChangeRatio && format(".2f")(currentItem.netChangeRatio) + '%',
                stroke: this.getTickStroke(currentItem.netChangeRatio, 0)
              }, {
                label: "开    盘",
                value: currentItem.open && transfromData({data: currentItem.open, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.open, currentItem.preClose)
              }, {
                label: '收    盘',
                value: currentItem.close && transfromData({data: currentItem.close, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.close, currentItem.preClose)
              }, {
                label: "最    高",
                value: currentItem.high && transfromData({data: currentItem.high, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.high, currentItem.preClose)
              }, {
                label: '最    低',
                value: currentItem.low && transfromData({data: currentItem.low, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.low, currentItem.preClose)
              }, {
                label: '成交量',
                value: currentItem.volume && transfromData({data: currentItem.volume, info: {isNum: true}}),
                stroke: '#e7940c'
              }, {
                label: '成交额',
                value: currentItem.amount && transfromData({data: currentItem.amount}),
                stroke: '#e7940c'
              }].filter(line => line.value !== undefined)
            }
          }}
        />
      }
      <MouseCoordinateY
        {...this.getAxisCoorY('right')}
      />
      <MouseCoordinateY
        {...this.getAxisCoorY('left')}
      />
      <CandlestickSeries
        clip={false}
        wickStroke={d => this.isLimit(d)}
        stroke={d => this.isLimit(d)}
        fill={d => this.isLimit(d, true)}
        opacity={1}
      />
      <Annotate
        with={SvgHighOrLowAnnotation}
        whenByData={d => [_maxBy(d, 'high')]}
        clip={false}
        usingProps={{
          y: ({ yScale, datum }) => yScale(datum.high),
          path: highPath,
          textParse: d => transfromData({data: d.high, uuid: this.symbol}),
          fill: fontColor,
        }}
      />
      <Annotate
        with={SvgHighOrLowAnnotation}
        whenByData={d => [_minBy(d, 'low')]}
        clip={false}
        usingProps={{
          y: ({ yScale, datum }) => yScale(datum.low),
          path: lowPath,
          textParse: d => transfromData({data: d.low, uuid: this.symbol}),
          fill: fontColor,
        }}
      />
      {
        showByIndLine.length > 0 && showByIndLine.map(config => {
          let chart = null;
          switch(config.type){
            case 'MA':
            case 'BOLL':
              chart = config.tipConfig.configs.map(({key, stroke}) => {
                return (
                  <div key={key}>
                    <LineSeries yAccessor={d => d[key]} stroke={stroke} />
                    <CurrentCoordinate yAccessor={d => d[key]} fill={stroke} />
                  </div>
                )
              });
              break;
          }
          return chart;
        })
      }
    </Chart>
  )
  return [mainChart];
}

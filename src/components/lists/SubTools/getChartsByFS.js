import React, { Component } from 'react';
import { ChartCanvas, Chart } from "@/components/react-stockcharts";
import {
  AreaSeries,
  LineSeries,
  BarSeries,
} from "@/components/react-stockcharts/lib/series";
import { XAxis, YAxis } from "@/components/react-stockcharts/lib/axes";

import { OHLCTooltip, HoverTooltip } from "@/components/react-stockcharts/lib/tooltip";
import {
  MouseCoordinateX,
  MouseCoordinateY,
  CurrentCoordinate,
} from "@/components/react-stockcharts/lib/coordinates";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { transfromData } from '@/utils/FormatUtils';
import { getLimitValue } from './';
import {DrawLine, KlineBar} from '@/components/lists/SubTools'
import _findLastIndex from 'lodash/findLastIndex';
const styleConfig = require('@/theme/')();

// const textColor = '#d8dfeb', lineColor = '#5faaf5';
const { kLineUnder: highColor,
  kLineUpper: lowColor,
  kLineUnder2: highColor2,
  kLineUpper2: lowColor2,
  kLineMidVol: textColor,
  FslineColorAvgPrice: lineColor,
  FslineColorPrice: lineColor2,
  kLineVolx: volColorx,
  kLineVoly: volColory } = styleConfig;


export function getChartsByFS({chartCanvasConfig, XAxisTickValue}) {
  // K线类型主图表
  const { barConfig, klineBarProps } = this.props;
  const { data, width, height, margin } = chartCanvasConfig;
  const { activeIndex } = this.props;
  const { showByIndChart, showByIndLine } = this.state;
  let tickValues = []
    , self = this
    , maxValue = []
    , _tickValues = []
    , _maxValue = []
    , barMaxValue = 0
    , temp
    , limitItem
    , middNum
    , mainHeight = height - this.subChartHeight * showByIndChart.length;
  if (mainHeight < 200) {
    middNum = 1;
  } else if (mainHeight < 300) {
    middNum = 3;
  } else if (mainHeight < 400) {
    middNum = 4;
  } else if (mainHeight < 500) {
    middNum = 5;
  } else if (mainHeight < 600) {
    middNum = 6;
  } else {
    middNum = 7;
  }
  (temp = getLimitValue({ data, middNum }), temp) && ([tickValues, maxValue, _tickValues, _maxValue, barMaxValue, limitItem] = temp);
  let chartWidth = width - margin.left - margin.right;
  let mainChartHeight = height - this.barHeight - showByIndChart.length * this.subChartHeight - this.commonTipHeight;
  // 左边坐标轴显示
  let leftYAxis = (
    <Chart
      id={this.compId + '-fs-left'}
      key={this.compId + '-fs-left'}
      height={mainChartHeight}
      yExtents={_maxValue}
    >
          <KlineBar
            onZoom={arg => this.zoom(arg)}
            onClickHandle={args => this.onClickHandle(args)}
            saveChartToPng={this.saveChartToPng}
            parentNode={this}
            dot={(temp = window.codelist.data[this.symbol], temp) && temp.digit || 2}
            config={barConfig}
            newData={data[_findLastIndex(data, item => item.price !== undefined)]}
            chartCanvasConfig={chartCanvasConfig}
            barHeight={this.barHeight}
            showByIndLine={showByIndLine}
            barConfig={barConfig}
            stockInfo={this.stockInfo}
            {...klineBarProps}
          >
          </KlineBar>
      <MouseCoordinateY
        {...this.getAxisCoorY('left')}
      />
      <YAxis
        innerTickSize={-1 * chartWidth}
        ticks={11}
        tickValues={_tickValues}
        {...this.getAxisStyle('left')}
        tickStroke={index => this.getTickStroke(index, middNum)}
        tickLineStrokeOpacity={0}
        tickFormat={data => transfromData({data, uuid: this.symbol})}
      />
      <LineSeries
        yAccessor={d => d.avgPrice}
        stroke={lineColor}
      />
      <AreaSeries
        clip={false}
        yAccessor={d => d.price}
        opacity={0.3}
        fill="#1d2c53"
        stroke={lineColor2}
        drawLineBefore={({ctx, data, xScale, yScale}) => {
          if(window.superMonitor[self.props.actionName].indexAt === undefined)return;
          ctx.beginPath();
          ctx.moveTo(xScale(-1), yScale(data[0].open));
          ctx.lineTo(xScale(0), yScale(data[0].price));
          ctx.stroke();
          ctx.closePath();
        }}
      />
      <CurrentCoordinate
        yAccessor={d => d.avgPrice}
        fill={lineColor}
      />
    </Chart>
  )
  let mainChart = (
    <Chart
      id={this.compId + '-fs-main'}
      key={this.compId + '-fs-main'}
      height={mainChartHeight}
      yExtents={maxValue}
      onContextMenu={this.contextMenuHandle}
    >
      <DrawLine chartName='FS'/>
      <YAxis
        innerTickSize={-1 * chartWidth}
        ticks={11}
        tickFormat={value => format('.2f')(Math.abs(value)) + ' %'}
        tickValues={tickValues}
        {...this.getAxisStyle('right')}
        tickStroke={index => this.getTickStroke(index, middNum)}
        tickLineStrokeOpacity={index => index === middNum ? 0.8 : 0.08}
      />
      {
        this.props.hasTipPanel &&
        <HoverTooltip
          bgFill={'#1c243c'}
          fill={'#1c243c'}
          fontFill='#ccc'
          fontSize={16}
          tooltipContent={({ currentItem, xAccessor }) => {
            return {
              x: timeFormat(barConfig.panelFormat)(xAccessor(currentItem)),
              y: [{
                label: "涨跌幅",
                value: currentItem.netChangeRatio && format(".2f")(currentItem.netChangeRatio) + '%',
                stroke: this.getTickStroke(currentItem.netChangeRatio, 0)
              }, {
                label: "价    格",
                value: currentItem.price && transfromData({data: currentItem.price, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.price, currentItem.preClose)
              }, {
                label: '均    价',
                value: currentItem.avgPrice && transfromData({data: currentItem.avgPrice, uuid: this.symbol}),
                stroke: this.getTickStroke(currentItem.avgPrice, currentItem.preClose)
              }, {
                label: '成交量',
                value: currentItem.nowVolume && transfromData({data: currentItem.nowVolume, info: {isNum: true}}),
                stroke: '#e7940c'
              }, {
                label: '成交额',
                value: currentItem.nowAmount && transfromData({data: currentItem.nowAmount}),
                stroke: '#e7940c'
              }].filter(line => line.value !== undefined)
            }
          }}
        />
      }
      {
        showByIndChart.length === 0 && (
          <XAxis
            innerTickSize={-1 * chartCanvasConfig.mainChartHeight}
            zoomEnabled={false}
            ticks={9}
            tickFormat={d => timeFormat("%H:%M")(data[d].date)}
            tickValues={XAxisTickValue}
            {...this.getAxisStyle('bottom')}
            tickStroke={volColorx}
          />
        )
      }
      <CurrentCoordinate
        yAccessor={d => d.netChangeRatio}
        fill={lineColor2}
      />

      <MouseCoordinateY
        {...this.getAxisCoorY('right')}
        displayFormat={data => isNaN(data) || data === undefined? '--': format(".2f")(data) + ' %'}
      />
    </Chart>
  )
  return [leftYAxis, mainChart];
}


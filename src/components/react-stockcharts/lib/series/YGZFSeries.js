import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";
import LineSeries from "./LineSeries";
import {CurrentCoordinate} from "../coordinates";

import { isDefined } from "../utils";

class YGZFSeries extends Component {
  constructor(props) {
    super(props);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.yAccessorForLine = this.yAccessorForLine.bind(this);
  }

  yAccessorForLine(d, key, defaultData) {
    if(defaultData !== undefined)return defaultData;
    const { yAccessor } = this.props;
    return yAccessor(d) && yAccessor(d)[key];
  }

  drawOnCanvas(ctx, moreProps) {
    const { xAccessor } = moreProps;
    const { xScale, chartConfig: { yScale }, plotData } = moreProps;

    const { yAccessor } = this.props;

    const candles = getRenko(this.props, plotData, xScale, xAccessor, yScale, yAccessor);

    drawOnCanvas(ctx, candles);
  }

  render() {
    const { className, clip, yAccessor, appearance } = this.props;

    return (
      <g className={className}>
        {
          appearance.map(config => {
            if(config.drawType === 'line'){
              return (
                <LineSeries
                  yAccessor={d => this.yAccessorForLine(d, config.key, config.default)}
                  stroke={config.stroke}
                  fill="none"
                />
              )
            }
            return null;
          })
        }
        <GenericChartComponent
          clip={clip}
          canvasDraw={this.drawOnCanvas}
          canvasToDraw={getAxisCanvas}
          drawOn={["pan"]}
        />
      </g>
    );
  }
}

YGZFSeries.propTypes = {
  classNames: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string
  }),
  stroke: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string
  }),
  fill: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string,
    partial: PropTypes.string
  }),
  yAccessor: PropTypes.func.isRequired,
  clip: PropTypes.bool.isRequired,
};

YGZFSeries.defaultProps = {
  clip: true,
  className: ''
};

function drawOnCanvas(ctx, renko) {
  renko.forEach(item => {
    item.forEach((d, i) => {
      console.log(i, d);
      ctx.beginPath();

      ctx.strokeStyle = d.fill;
      ctx.fillStyle = d.fill;

      ctx.rect(d.x, d.y, d.width, d.height);
      ctx.closePath();
      ctx.fill();
    })
  });
}

function getRenko(props, plotData, xScale, xAccessor, yScale, yAccessor) {
  const { classNames, fill } = props;
  const width = xScale(xAccessor(plotData[plotData.length - 1]))
    - xScale(xAccessor(plotData[0]));

  const candleWidth = (width / (plotData.length - 1));
  const candles = plotData
  //.filter(d => isDefined(yAccessor(d).close))
    .map(d => {
      const ohlc = yAccessor(d);
      const x = xScale(xAccessor(d)) - 0.5 * candleWidth;

      // 趋势块状图
      let ans = [{
        x: x,
        y: yScale(Math.min(ohlc.HJ_12, ohlc.HJ_13)),
        height: Math.abs(yScale(ohlc.HJ_12) - yScale(ohlc.HJ_13)),
        width: candleWidth,
        fill: ohlc.HJ_12 - ohlc.HJ_13 < 0? 'green': 'red',
      }, {
        x:x,
        width: 1,
        y: yScale(21),
        height: yScale(19) - yScale(21),
        fill: ohlc.lineHJflag? 'green': 'red'
      }];
      if(d.buySign){
        [{
          height: 22, width: 2, color: 'yellow'
        }, {
          height: 15, width: 5, color: 'magenta'
        }, {
          height: 5, width: 5, color: '#1199FF'
        }, {
          height: 5, width: 4.5, color: '#102099'
        }, {
          height: 5, width: 4, color: '#1020AA'
        }, {
          height: 5, width: 3.5, color: '#1020BB'
        }, {
          height: 5, width: 3, color: '#1020CC'
        }, {
          height: 5, width: 2.5, color: '#1020DD'
        }, {
          height: 5, width: 2, color: '#1020EE'
        }, {
          height: 5, width: 1, color: '#1020FF'
        }, {
          height: 15, width: 4.5, color: '#992010'
        }, {
          height: 15, width: 4, color: '#AA2010'
        }, {
          height: 15, width: 3.5, color: '#BB2010'
        }, {
          height: 15, width: 3, color: '#CC2010'
        }, {
          height: 15, width: 2.5, color: '#DD2010'
        }, {
          height: 15, width: 2, color: '#EE2010'
        }, {
          height: 15, width: 1, color: 'yellow'
        }].forEach(config => {
          ans.push({
            y: yScale(config.height),
            height: yScale(0) - yScale(config.height),
            x: xScale(xAccessor(d)) - config.width * candleWidth / 8,
            width: candleWidth * config.width / 4,
            fill: config.color,
            center: xScale(xAccessor(d))
          })
        })
      }
      return ans;
    });
  return candles;
}

export default YGZFSeries;

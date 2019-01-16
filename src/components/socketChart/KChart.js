import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "../react-stockcharts";
import { BarSeries, CandlestickSeries, AreaSeries, LineSeries } from "../react-stockcharts/lib/series";
import { XAxis, YAxis } from "../react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY
} from "../react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "../react-stockcharts/lib/scale";
import { ema, heikinAshi, sma } from "../react-stockcharts/lib/indicator";
import { fitWidth } from "../react-stockcharts/lib/helper";
import { last } from "../react-stockcharts/lib/utils";

const styleConfig = require('@/theme/')();
const { kLineUnder: highColor, kLineUpper: lowColor } = styleConfig;



class CandleStickChartWithCHMousePointer extends React.Component {
	isLimit(data) {
		if (data.close === data.open && data.high === data.low && data.high === data.close && data.open === data.low) {
			return '#ffffff';
		} else {
			return data.close < data.open ? lowColor : "rgba(0, 0, 0, 0)"
		}
	}
	tickValuesFn(data) {
		let tickValues1 = [];
		let tickValues = [];
		data.map((item, index, ans) => {
			tickValues1.push(index);
		});
		if (data.length == 1) {
			var iObj = {};
			for (var i in data[0]) {

				if (i == 'date') {
					iObj[i] = data[0][i]
				} else {
					iObj[i] = ''
				}
			}
			data.push(iObj)
			tickValues = [1]
		} else if (data.length < 10) {
			tickValues = [0]
		} else {
			tickValues = [tickValues1[0], tickValues1[parseInt((tickValues1.length) / 2)], tickValues1[tickValues1.length - 1]]
		}
		return tickValues
	}

	render() {
		const { type, data: initialData, width, ratio, height,  preCloseArr, amountArr } = this.props;


		let _width = width - (parseFloat(initialData.length / 40) * (width - 65 - 65)) - 65
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);
		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, 0];

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
		return (
			<ChartCanvas
				height={height}
				ratio={ratio}
				width={width}
				margin={{ left: 65, right: _width, top: 0, bottom: 30 }}
				// padding={{right: 165}}
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

				<Chart id={1}
					height={height * 2 / 3}
					yExtents={d => [d.high, d.low]}
					padding={{ top: 20, bottom: 25 }}>

					<YAxis
						fontSize={10}
						tickStroke="#d8dfeb"
						stroke="#d8dfeb"
						opacity="0.1"
						axisAt={width - 130}
						zoomEnabled={false}
						orient="right"
						ticks={5}
						tickFormat={format(".2f")}
						tickValues={preCloseArr}

						innerTickSize={-1 * (width - 130)}
						tickStroke="#d8dfeb"
						tickStrokeDasharray="Dash"
						tickStrokeOpacity={0.1}
						tickLineStrokeOpacity={0.08}
					/>
					<YAxis
						fontSize={10}
						tickStroke="#d8dfeb"
						stroke="#d8dfeb"
						opacity="0.1"
						axisAt="left"
						zoomEnabled={false}
						orient="left"
						ticks={5}
						tickFormat={format(".2f")}
						tickValues={preCloseArr}

						innerTickSize={-1 * (height - 30)}
						tickStroke="#d8dfeb"
						tickStrokeDasharray="Dash"
						tickStrokeOpacity={0.1}
						tickLineStrokeOpacity={0.08}
					/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")}
						stroke={'#3174ed'}
						opacity={1}
						fill={'#191b31'}
						fontSize={10}
						arrowWidth={0}
					/>
					<CandlestickSeries
						clip={false}
						stroke={d => (d.close < d.open ? lowColor : highColor)}
						wickStroke={d => (d.close < d.open ? lowColor : highColor)}
						fill={d => this.isLimit(d)}
						opacity={1}
					/>
					{/* <AreaSeries yAccessor={d => d.close} stroke={ema20.stroke()} />
          			<LineSeries yAccessor={d => d.open} stroke={ema50.stroke()}/> */}

				</Chart>
				<Chart
					id={2}
					height={height / 6}
					yExtents={amountArr}
					origin={(w, h) => [0, h - height / 6]}
				>
					<XAxis
						fontSize={10}
						tickStroke="#d8dfeb"
						stroke="#d8dfeb"
						opacity="0.1"
						axisAt="bottom"
						orient="bottom"
						ticks={3}
						zoomEnabled={false}
						tickFormat={d => timeFormat("%Y-%m-%d")(data[d].date)}
						tickValues={this.tickValuesFn(data)}

					/>
					<YAxis
						fontSize={10}
						stroke="#d8dfeb"
						opacity="0.1"
						axisAt="left"
						orient="left"
						zoomEnabled={false}
						ticks={2}
						tickValues={amountArr}
						innerTickSize={-1 * (width - 130)}
						tickStroke="#d8dfeb"
						tickStrokeDasharray="solid"
						tickStrokeOpacity={0.1}
						tickLineStrokeOpacity={0.08}
						tickFormat={value => (value = value > 100000 ? format(".2f")(value / 10000) + '万' : format(".2f")(value))}
					/>

					<YAxis
						fontSize={10}

						tickStroke="#d8dfeb"
						stroke="#d8dfeb"
						opacity="0.1"
						axisAt={width - 130}
						orient="right"
						zoomEnabled={false}
						ticks={2}
						tickValues={amountArr}
						tickFormat={value => (value = value > 100000 ? format(".2f")(value / 10000) + '万' : format(".2f")(value))}
					/>


					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						fontSize={10}
						stroke={'#3174ed'}
						opacity={1}
						fill={'#191b31'}
						arrowWidth={0}
					/>
					<MouseCoordinateY
						at="left"
						rectWidth={width}
						orient="left"
						displayFormat={format(".2f")}
						stroke={'#3174ed'}
						opacity={1}
						fill={'#191b31'}
						fontSize={10}
						arrowWidth={0}
					/>

					<BarSeries
						clip={false}
						yAccessor={d => d.amount}
						opacity={1}
						fill={d => (d.close < d.preClose ? lowColor : highColor)}
					/>
				</Chart>
				<CrossHairCursor stroke="#3174ed" opacity={1} />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithCHMousePointer.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithCHMousePointer.defaultProps = {
	type: "'svg'"
};
CandleStickChartWithCHMousePointer = fitWidth(
	CandleStickChartWithCHMousePointer
);

export default CandleStickChartWithCHMousePointer;

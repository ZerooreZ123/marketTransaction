
import { scalePoint } from  "d3-scale";
import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "../react-stockcharts";
import { BarSeries } from "../react-stockcharts/lib/series";
import { XAxis, YAxis } from "../react-stockcharts/lib/axes";
import { fitWidth } from "../react-stockcharts/lib/helper";
import { discontinuousTimeScaleProvider } from "../react-stockcharts/lib/scale";
import { last } from "../react-stockcharts/lib/utils";
import { timeFormat } from "d3-time-format";

class BarChart extends React.Component {
	render() {
        const { data: stkcnMnyFlowDataArr, type, width, ratio } = this.props;
        const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
        const { data, xScale, xAccessor, displayXAccessor} = xScaleProvider(
			stkcnMnyFlowDataArr
		);
        const start = xAccessor(last(data));
		const xExtents = [start, 0];

		return (
			<ChartCanvas ratio={ratio}
				width={width}
				height={400}
				margin={{ left: 80, right: 10, top: 20, bottom: 30 }}
				type={type}
				seriesName="Fruits"
				xExtents={xExtents}
				data={data}
				xAccessor={xAccessor}
				xScale={xScale}
                padding={1}
                mouseMoveEvent={true}
				panEvent={false}
				zoomEvent={false}
				clamp={false}
			>
				<Chart id={1} yExtents={d => [0, d.main_mny_net_in]}>
					<XAxis axisAt="bottom" orient="bottom" tickFormat={d => timeFormat("%Y-%m-%d")(data[d].date)} ticks={13} />
					<YAxis axisAt="left" orient="left" />
					<BarSeries yAccessor={d => d.main_mny_net_in} fill={d => (d.main_mny_net_in <0 ? "#ff262e" : "#14b143")}/>
				</Chart>
			</ChartCanvas>

		);
	}
}

BarChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BarChart.defaultProps = {
	type: "svg",
};

BarChart = fitWidth(BarChart);

export default BarChart;

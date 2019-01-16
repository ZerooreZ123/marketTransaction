
import { set } from "d3-collection";
import { scaleOrdinal, schemeCategory10, scaleLinear, scaleLog } from "d3-scale";
import { format } from "d3-format";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "../react-stockcharts";
import { ScatterSeries, CircleMarker } from "../react-stockcharts/lib/series";
import { XAxis, YAxis } from "../react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    MouseCoordinateX,
    MouseCoordinateY,
} from "../react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "../react-stockcharts/lib/scale";

import { fitWidth } from "../react-stockcharts/lib/helper";
import { last } from "../react-stockcharts/lib/utils";

class BubbleChart extends React.Component {

    BasSpclNtcTypeFn(code) {
        switch (code) {
            case 1:
                return '股票分红';
                break;
            case 2:
                return '大宗交易';
                break;
            case 3:
                return '违规处罚';
                break;
            case 4:
                return '龙虎榜';
                break;
            case 5:
                return '公告提示';
                break;
            case 6:
                return '首次发行';
                break;
            case 7:
                return '公开增发';
                break;
            case 8:
                return '非公开增发';
                break;
            case 9:
                return '配股';
                break;
            case 10:
                return '收益分配';
                break;
            case 11:
                return '销售流通';
                break;
            case 12:
                return '股东大会';
                break;
            case 13:
                return '公告停牌';
                break;
            case 14:
                return '事项变更';
                break;
            case 15:
                return '证券交易状态';
                break;
            case 16:
                return '风险提示';
                break;
            default:
                break;
        }
    }

    render() {
        // const { data: unsortedData, type, width, ratio ,baseEvtNameArr,basTimeArr} = this.props;
        const { type, data: unsortedData, width, ratio, baseEvtNameArr, tickValueArr, basTimeArr } = this.props;

        const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
            d => d.evt_time
        );
        const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
            unsortedData
        );
        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length)]);
        const xExtents = [start, 0];

        const r = scaleLinear()
            .range([2, 20])
            .domain(extent(data, d => d.evt_typ_code));

        const f = scaleOrdinal(schemeCategory10)
            .domain(set(data.map(d => d.evt_typ_code)));

        const fill = d => f(d.evt_typ_code);
        const radius = d => r(8);

        return (
            <ChartCanvas ratio={ratio} width={width} height={200}
                margin={{ left: 70, right: 70, top: 20, bottom: 30 }} type={type}
                seriesName="Wealth & Health of Nations"
                data={data}
                xAccessor={xAccessor}
                xScale={xScale}
                xExtents={xExtents}
                displayXAccessor={displayXAccessor}
                ratio={ratio}
                padding={{ left: 20, right: 20 }}
            >
                <Chart id={1}
                    yExtents={d => d.evt_typ_code_init}
                    yMousePointerRectWidth={20}
                    padding={{ top: 20, bottom: 20 }}>
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        // ticks={5}
                        tickStroke="#d8dfeb"
                        stroke="#d8dfeb"
                        zoomEnabled = {false}
                        tickFormat={d => timeFormat("%Y-%m-%d")(data[d].evt_time)}
                    />
                    <YAxis 
                        axisAt="left" 
                        orient="left"
                        tickFormat={d => (d = this.BasSpclNtcTypeFn(d))}
                        tickValues={this.tickValueArr}
                        tickStroke="#d8dfeb"
                        stroke="#d8dfeb"
                        zoomEnabled = {false}
                    />

                    <ScatterSeries yAccessor={d => d.evt_typ_code_init} marker={CircleMarker}
                        fill={fill}
                        markerProps={{ r: radius, fill: fill }} />

                    {/* <MouseCoordinateX snapX={false}
						at="bottom"
						orient="bottom"
						rectWidth={50}
						displayFormat={format(".0f")} />
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".2f")} /> */}
                </Chart>
                <CrossHairCursor snapX={false} />
            </ChartCanvas>

        );
    }
}

BubbleChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BubbleChart.defaultProps = {
    type: "svg",
};
BubbleChart = fitWidth(BubbleChart);

export default BubbleChart;

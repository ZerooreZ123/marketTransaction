

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";

import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { functor } from "../utils";

class MACDTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { onClick, fontFamily, fontSize, displayFormat, className } = this.props;
		const { yAccessor, options, appearance, labelFill } = this.props;
		const { displayValuesFor } = this.props;

		const { chartConfig: { width, height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const macdValue = currentItem && yAccessor(currentItem);

		const MACD = (macdValue && macdValue.MACD && displayFormat(macdValue.MACD)) || "n/a";
		const DEA = (macdValue && macdValue.DEA && displayFormat(macdValue.DEA)) || "n/a";
		const DIF = (macdValue && macdValue.DIF && displayFormat(macdValue.DIF)) || "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);
    const macdColor = appearance.fill.MACD(parseFloat(MACD));

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>MACD ({options.fast}, {options.slow}, {options.signal})</ToolTipTSpanLabel>
					<ToolTipTSpanLabel fill={appearance.stroke.DIF}>　 DIF: </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.DIF}>{DIF}</tspan>
					<ToolTipTSpanLabel fill={appearance.stroke.DEA}>　 DEA: </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.DEA}>{DEA}</tspan>
					<ToolTipTSpanLabel fill={macdColor}>　 MACD: </ToolTipTSpanLabel>
					<tspan fill={macdColor}>{MACD}</tspan>
				</ToolTipText>
			</g>
		);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

MACDTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,

	yAccessor: PropTypes.func.isRequired,
	options: PropTypes.shape({
		slow: PropTypes.number.isRequired,
		fast: PropTypes.number.isRequired,
		signal: PropTypes.number.isRequired,
	}).isRequired,
	appearance: PropTypes.shape({
		stroke: {
			macd: PropTypes.string.isRequired,
			signal: PropTypes.string.isRequired,
		}.isRequired,
		fill: PropTypes.shape({
			divergence: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
	displayFormat: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	onClick: PropTypes.func,
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: format(".3f"),
	displayValuesFor: displayValuesFor,
	className: "react-stockcharts-tooltip",
  fontSize: 12,
  labelFill: '#ccc'
};

export default MACDTooltip;
// export default MACDTooltip;

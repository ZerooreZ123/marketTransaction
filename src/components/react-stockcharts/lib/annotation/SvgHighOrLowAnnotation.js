

import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "../utils";

class SvgHighOrLowAnnotation extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		const { onClick } = this.props;

		if (onClick) {
			const { xScale, yScale, datum } = this.props;
			onClick({ xScale, yScale, datum }, e);
		}
	}
	render() {
		const { className, stroke, opacity, textParse, fontSize } = this.props;
		const { xAccessor, xScale, yScale, path, datum, chartWidth, strokeWidth } = this.props;

		const { x, y, fill, tooltip } = helper(this.props, xAccessor, xScale, yScale);
    const textShow = textParse(datum);
    const {pathD, textProps} = path({x, y, direction: x * 2 > chartWidth, textShow, fontSize, offsetY: 4});

		return (<g className={className} onClick={this.handleClick}>
      <path d={pathD} stroke={stroke} opacity={opacity} />
      <text {...textProps} fill={fill} strokeWidth={strokeWidth} >{textShow}</text>
		</g>);
	}
}

function helper(props, xAccessor, xScale, yScale) {
	const { x, y, datum, fill, tooltip, plotData } = props;

	const xFunc = functor(x);
	const yFunc = functor(y);

	const [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		x: xPos,
		y: yPos,
		fill: functor(fill)(datum),
		tooltip: functor(tooltip)(datum),
	};
}

SvgHighOrLowAnnotation.propTypes = {
	className: PropTypes.string,
	path: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
  textParse: PropTypes.func,
	fontSize: PropTypes.number,
	strokeWidth: PropTypes.number,
};

SvgHighOrLowAnnotation.defaultProps = {
	className: "react-stockcharts-svghighorlowannotation",
	opacity: 1,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
  stroke: '#ccc',
  textParse: _ => '',
  fontSize: 12,
  strokeWidth: 1
};

export default SvgHighOrLowAnnotation;

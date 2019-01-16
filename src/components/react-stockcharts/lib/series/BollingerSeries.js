

import React, { Component } from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

class BollingerSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForTop = this.yAccessorForTop.bind(this);
		this.yAccessorForMiddle = this.yAccessorForMiddle.bind(this);
		this.yAccessorForBottom = this.yAccessorForBottom.bind(this);
		this.yAccessorForScalledBottom = this.yAccessorForScalledBottom.bind(this);
	}
	yAccessorForTop(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).UB;
	}
	yAccessorForMiddle(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).BOLL;
	}
	yAccessorForBottom(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).LB;
	}
	yAccessorForScalledBottom(scale, d) {
		const { yAccessor } = this.props;
		return scale(yAccessor(d) && yAccessor(d).LB);
	}
	render() {
		const { areaClassName, className, opacity } = this.props;
		const { appearance } = this.props;

		return (
			<g className={className}>
				<LineSeries yAccessor={this.yAccessorForTop}
					stroke={appearance.UB} fill="none" />
				<LineSeries yAccessor={this.yAccessorForMiddle}
					stroke={appearance.BOLL} fill="none" />
				<LineSeries yAccessor={this.yAccessorForBottom}
					stroke={appearance.LB} fill="none" />
        {/*<AreaOnlySeries className={areaClassName}
					yAccessor={this.yAccessorForTop}
					base={this.yAccessorForScalledBottom}
					stroke="none" fill={fill}
					opacity={opacity} />*/}
			</g>
		);
	}
}

BollingerSeries.propTypes = {
	yAccessor: PropTypes.func.isRequired,
	className: PropTypes.string,
	areaClassName: PropTypes.string,
	opacity: PropTypes.number,
	type: PropTypes.string,
};

BollingerSeries.defaultProps = {
	className: "react-stockcharts-bollinger-band-series",
	areaClassName: "react-stockcharts-bollinger-band-series-area",
	opacity: 0.2
};

export default BollingerSeries;

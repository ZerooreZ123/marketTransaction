

import React, { Component } from "react";
import PropTypes from "prop-types";

import BarSeries from "./BarSeries";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";
import {CurrentCoordinate} from "../coordinates";

class MACDSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForMACD = this.yAccessorForMACD.bind(this);
		this.yAccessorForSignal = this.yAccessorForSignal.bind(this);
		this.yAccessorForDivergence = this.yAccessorForDivergence.bind(this);
		this.yAccessorForDivergenceBase = this.yAccessorForDivergenceBase.bind(this);
	}
	yAccessorForMACD(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).MACD;
	}
	yAccessorForSignal(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).DEA;
	}
	yAccessorForDivergence(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).DIF;
	}
	yAccessorForDivergenceBase(xScale, yScale/* , d */) {
		return yScale(0);
	}
	render() {
		const { className, opacity, divergenceStroke, widthRatio, width } = this.props;
		const { appearance } = this.props;

		const { clip } = this.props;
		const { zeroLineStroke, zeroLineOpacity } = this.props;

    let fill = {}, isShow = {};
    appearance.forEach(item => {
      fill[item.key] = item.stroke;
      isShow[item.key] = item.isShow;
    });


		return (
			<g className={className}>
        {
          isShow.MACD !== false &&
            <BarSeries
              baseAt={this.yAccessorForDivergenceBase}
              className="macd-divergence"
              width={width}
              widthRatio={widthRatio}
              stroke={divergenceStroke}
              fill={d => fill.MACD(d.MACD)}
              opacity={opacity}
              clip={clip}
              yAccessor={this.yAccessorForMACD} />
        }
        {
          isShow.DIF !== false &&
            <g>
              <LineSeries
                yAccessor={this.yAccessorForDivergence}
                stroke={fill.DIF}
                fill="none" />
              <CurrentCoordinate
                yAccessor={this.yAccessorForDivergence}
                fill={fill.DIF}
              />
            </g>
        }
        {
          isShow.DEA !== false &&
            <g>
              <LineSeries
                yAccessor={this.yAccessorForSignal}
                stroke={fill.DEA}
                fill="none" />
              <CurrentCoordinate
                yAccessor={this.yAccessorForSignal}
                fill={fill.DEA}
              />
            </g>
        }
				<StraightLine
					stroke={zeroLineStroke}
					opacity={zeroLineOpacity}
          stroke="#ffffff"
          strokeDasharray="Dash"
					yValue={0} />
			</g>
		);
	}
}

MACDSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number,
	divergenceStroke: PropTypes.bool,
	zeroLineStroke: PropTypes.string,
	zeroLineOpacity: PropTypes.number,
	clip: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number,
	width: BarSeries.propTypes.width,
};

MACDSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	divergenceStroke: false,
	clip: true,
	widthRatio: 0.5,
	width: BarSeries.defaultProps.width,
};

export default MACDSeries;

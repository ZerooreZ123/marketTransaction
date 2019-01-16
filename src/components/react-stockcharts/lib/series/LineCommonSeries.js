import React, { Component } from "react";
import PropTypes from "prop-types";

import BarSeries from "./BarSeries";
import LineSeries from "./LineSeries";
import {CurrentCoordinate} from "../coordinates";

class LineCommonSeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForLine = this.yAccessorForLine.bind(this);
	}

	yAccessorForLine(d, key) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d)[key];
	}

	render() {
		const { className, opacity, widthRatio, width } = this.props;
		const { appearance } = this.props;

		return (
			<g className={className}>
        {
          appearance.map(config => {
            if(config.isShow === false)return null;
            if(config.drawType === 'bar'){
              return (
                <BarSeries
                  key={config.key}
                  yAccessor={d => this.yAccessorForLine(d, config.key)}
                  fill={config.stroke}
                  clip={false}
                  opacity={1}
                />
              )
            }
            return (
              <g>
                <LineSeries
                  key={'line' + config.key}
                  yAccessor={d => this.yAccessorForLine(d, config.key)}
                  stroke={config.stroke}
                  fill="none"
                />
                <CurrentCoordinate
                  key={'coor' + config.key}
                  yAccessor={d => this.yAccessorForLine(d, config.key)}
                  fill={config.stroke}
                />
              </g>
            )
          })
        }
			</g>
		);
	}
}

LineCommonSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number,
	zeroLineStroke: PropTypes.string,
	zeroLineOpacity: PropTypes.number,
	widthRatio: PropTypes.number,
	width: BarSeries.propTypes.width,
};

LineCommonSeries.defaultProps = {
	className: "react-stockcharts-macd-series",
	zeroLineStroke: "#000000",
	zeroLineOpacity: 0.3,
	opacity: 1,
	widthRatio: 0.5,
	width: BarSeries.defaultProps.width,
};

export default LineCommonSeries;

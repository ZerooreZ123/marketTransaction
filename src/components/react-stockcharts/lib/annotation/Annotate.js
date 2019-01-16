

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";

class Annotate extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	render() {
    const {clip} = this.props;
		return <GenericChartComponent
      clip={clip}
			svgDraw={this.renderSVG}
			drawOn={["pan"]}
		/>;
	}
	renderSVG(moreProps) {
		const { xAccessor, width } = moreProps;
		const { xScale, chartConfig: { yScale }, plotData } = moreProps;

		const { className, usingProps, with: Annotation, when, whenByData } = this.props;
    //handlePlotData && handlePlotData(plotData);
    let data;
    if(whenByData){
      data = whenByData(plotData);
    }else if(when){
      data = helper(this.props, plotData);
    }
    if(!data)return;

		return (
			<g className={`react-stockcharts-enable-interaction ${className}`}>
				{data.map((d, idx) => <Annotation key={idx}
					{...usingProps}
					xScale={xScale}
					yScale={yScale}
					xAccessor={xAccessor}
					plotData={plotData}
          chartWidth={width}
					datum={d} />)}
			</g>
		);
	}
}

Annotate.propTypes = {
	className: PropTypes.string,
	with: PropTypes.func,
	when: PropTypes.func,
	usingProps: PropTypes.object,
	clip: PropTypes.bool,
};

Annotate.defaultProps = {
	className: "react-stockcharts-annotate react-stockcharts-default-cursor",
  clip: true
};

function helper({ when }, plotData) {
	return plotData.filter(when);
}

export default Annotate;

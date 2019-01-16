import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";

import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { functor } from "../utils";
import closeSvg from "@/resources/images/close_svg.png";
import settingSvg from "@/resources/images/setting_svg.png";
import resetSvg from "@/resources/images/reset_svg.png";

const styleConfig = require('@/theme/')();
const {
  "background-color-plate": backColor
} = styleConfig;

class CommonTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}

	renderSVG(moreProps) {
		const { defaultData, dot, onClick, fontFamily, fontSize, className, divStyle, clickHandle } = this.props;
		const { indexInfo, labelFill, chartCanvasConfig: {margin: chartMargin, width: chartWidth} } = this.props;
    const { options, tipConfig: {label, configs, hasTipTool} } = indexInfo;
    if(hasTipTool === false)return null;
		const { displayValuesFor } = this.props;

		const { chartConfig: { width, height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const data = currentItem;

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);
    const panelWidth = chartWidth - chartMargin.left * 2;

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
        <path
          d={`M0 -14
              L${panelWidth},-14
              L${panelWidth},6
              L0,6
              Z`
          }
          style={divStyle}
        />
        <ToolTipText
          x={5}
          y={0}
          fontFamily={fontFamily}
          fontSize={fontSize}
        >
          {
            label && <ToolTipTSpanLabel fill={labelFill}>{label(options)}</ToolTipTSpanLabel>
          }
          {
            configs && configs.map(config => {
              let dataTmp = data && data.constructor === Object
                && ((config.key in data) && data[config.key])
                || (defaultData && (config.key in defaultData) && defaultData[config.key])
                || undefined;
              let value = (dataTmp !== undefined && format(`.${dot || 2}f`)(dataTmp)) || "--", fill;
              if(config.stroke){
                if(config.stroke.constructor === String){
                  fill = config.stroke;
                }else if(config.stroke.constructor === Function){
                  fill = config.stroke(value);
                }
              }
              return (
                <tspan>
                  <ToolTipTSpanLabel fill={fill}>　 {config.name}: </ToolTipTSpanLabel>
                  <tspan fill={fill}>{value}</tspan>
                </tspan>
              )
            })
          }
				</ToolTipText>
        {/**/}
        {
          [ {item: closeSvg, title: '关闭', name: 'index_close'},
            {item: settingSvg, title: '设置', name: 'index_setting'},
          ].map(({item, title, name}, index) => {
            return (
              <image
                xlinkHref={item}
                class={`${name}_btn`}
                width={fontSize}
                height={fontSize}
                x={panelWidth - fontSize - 5 * (index + 1) - fontSize * index}
                y={-10}
                cursor="pointer"
                onClick={e => clickHandle({e, type: name, config: indexInfo})}
              >
                <title>{title}</title>
              </image>
            )
          })
        }
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

CommonTooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,

	displayValuesFor: PropTypes.func,
	onClick: PropTypes.func,
	clickHandle: PropTypes.func,
};

CommonTooltip.defaultProps = {
	origin: [0, 0],
	displayValuesFor: displayValuesFor,
	className: "react-stockcharts-tooltip",
  fontSize: 12,
  labelFill: '#ccc',
  clickHandle: _ => _,
};

export default CommonTooltip;

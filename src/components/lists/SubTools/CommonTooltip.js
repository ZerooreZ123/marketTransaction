import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";

import displayValuesFor from "@/components/react-stockcharts/lib/tooltip/displayValuesFor";
import GenericChartComponent from "@/components/react-stockcharts/lib/GenericChartComponent";

import ToolTipText from "@/components/react-stockcharts/lib/tooltip/ToolTipText";
import ToolTipTSpanLabel from "@/components/react-stockcharts/lib/tooltip/ToolTipTSpanLabel";
import { functor } from "@/components/react-stockcharts/lib/utils";
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
    this.indexClickHandle = this.indexClickHandle.bind(this);
	}

  indexClickHandle({e, type, config}){
    const {parentNode} = this.props;
    switch(type){
      case 'index_close':
        parentNode.props.parentNode.handleClick({type: 'normType', norm: config.type});
        break;
      case 'index_setting':
        parentNode.highModalNode.updateView({config, visible: true});
        break;
    }
  }

	renderSVG(moreProps) {
		const { defaultData, dot, onClick, fontFamily, fontSize, className, divStyle} = this.props;
		const { indexInfo, labelFill, chartCanvasConfig: {margin: chartMargin, width: chartWidth}, boxHeight } = this.props;
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
    // 工具按钮的大小
    const toolsSize = fontSize + 2;
    // 左右间隙
    const gap = 5;

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
        <path
          d={`M0 -${boxHeight - 5}
              L${panelWidth},-${boxHeight - 5}
              L${panelWidth},0
              L0,0
              Z`
          }
          style={divStyle}
        />
        {/*<defs>
          <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood floodColor={backColor}/>
            <feComposite in="SourceGraphic"/>
          </filter>
        </defs>*/}
        <ToolTipText
          x={gap}
          y={-((boxHeight - fontSize) / 2)}
          fontFamily={fontFamily}
          fontSize={fontSize}
        >
          {
            label && <ToolTipTSpanLabel fill={labelFill}>{label(options)}</ToolTipTSpanLabel>
          }
          {
            configs && configs.map(config => {
              if(config.isShow === false)return null;
              let dataTmp = data && data.constructor === Object && this.props.parentNode.mouseOnChart
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
                width={toolsSize}
                height={toolsSize}
                x={panelWidth - toolsSize - gap * (index + 1) - toolsSize * index}
                y={-((boxHeight - toolsSize) / 2 + fontSize)}
                cursor="pointer"
                onClick={e => this.indexClickHandle({e, type: name, config: indexInfo})}
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
  boxHeight: PropTypes.number,
};

CommonTooltip.defaultProps = {
	origin: [0, 0],
	displayValuesFor: displayValuesFor,
	className: "react-stockcharts-tooltip",
  fontSize: 12,
  labelFill: '#ccc',
  boxHeight: 25
};

export default CommonTooltip;

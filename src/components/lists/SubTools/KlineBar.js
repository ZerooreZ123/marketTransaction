import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";
import displayValuesFor from "@/components/react-stockcharts/lib/tooltip/displayValuesFor";
import GenericChartComponent from "@/components/react-stockcharts/lib/GenericChartComponent";
import ToolTipText from "@/components/react-stockcharts/lib/tooltip/ToolTipText";
import ToolTipTSpanLabel from "@/components/react-stockcharts/lib/tooltip/ToolTipTSpanLabel";
import { functor } from "@/components/react-stockcharts/lib/utils";
import { connect } from 'react-redux';
import { SmallCompOrigin, SmallCompOriginByEmit } from '@/components/lists/SmallCompOrigin';
import { barConfig } from '@/components/lists/klineConfig';
import { controller, update } from '@/actions/';

const styleConfig = require('@/theme/')();
const {
  "background-color-plate": backColor
} = styleConfig;

class KlineBar extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  operHandler = ({e, operType, data}) => {
    e.stopPropagation()
    const { parentNode } = this.props;
    switch (operType) {
      case 'save':
        parentNode.saveChartToPng()
        break;
      case 'overlay':
        break;
      case 'tool':
        this.setState(
          prevState => ({ isShowToolsPanel: !prevState.isShowToolsPanel }),
          () => this.addEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.tools}`)
        );
        break;
      case 'hideTool':
        this.props.update({type: 'drawLineData', updateArr: [{enabledName: ''}]})
        this.setState(
          { isShowToolsPanel: false },
          () => this.removeEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.tools}`)
        );
        break;
      case 'smaller':
        parentNode.zoom(1);
        break;
      case 'bigger':
        parentNode.zoom(-1);
        break;
      case 'drawer':
        this.props.controller('isShowChartModelRight');
        break;
      case 'switchDrawLine':
        const {drawLineData} = this.props;
        if(drawLineData.icon === data.icon){
          this.props.update({type: 'drawLineData', updateArr: [{enabledName: '', icon: ''}]})
          //e.target.style.backgroundColor = '#ffffff';
        }else{
          this.props.update({type: 'drawLineData', updateArr: [{enabledName: data.compType, icon: data.icon}]})
          //e.target.style.backgroundColor = '#b6ddfb';
        }
        break;
    }
  }

	renderSVG(moreProps) {
		const { chartConfig: { width, height } } = moreProps;
		const currentData = displayValuesFor(this.props, moreProps);
    const {
      newData,
      config,
      labelFill,
      stockInfo,
      className,
      fontSize,
      chartCanvasConfig: {margin: chartMargin, width: chartWidth},
      isShowChartModelRight,
      barHeight,
      showByIndLine,
      dot,
      parentNode,
      hasStop,
      hasNewData,
      hasTools,
      hasName,
      hasCustomize,
      customizeData,
      offset=20,
    } = this.props;
    const newPriceActionName = `${stockInfo.uuid}-${stockInfo.exchange === 'INDEX' ? '6' : '5'}`;
    const priceing = [{
      title: '最新',
      class: 'stockNewValue',
      key: 'close',
      type: 'close',
      fill: '#60aaf5',
    }, {
      title: '均价',
      class: 'stockAvgValue',
      key: 'avgPrice',
      type: 'avgPrice',
      fill: '#de982d',
    }];
    const offsetLeft = chartMargin.left - offset;
    let tmp;

    return (
			<g className={className}>
        <ToolTipText
          x={offsetLeft * -1}
          y={barHeight * -0.5}
          fontSize={fontSize}
        >
          {
            hasName && (
              <ToolTipTSpanLabel fill={labelFill}>
                {stockInfo.stockName}
                <tspan dx={5} fontSize={Math.max(fontSize - 4, 10)}>
                ({config.title})
                </tspan>
              </ToolTipTSpanLabel>
            )
          }
          {
            config.hasStop && hasStop && (
              <tspan className="under" dx="10">
                {
                  stockInfo && stockInfo.stockStatus === 0
                    && '停牌中...'
                    || (
                      <SmallCompOrigin
                        actionName={newPriceActionName}
                        type='stockStatus'
                        parseFun={data => data === 0? '停牌中...': ''}
                        defaultData=''
                      />
                    )
                }
              </tspan>
            )
          }
          {// 自定义显示内容
            hasCustomize && customizeData.actionName && (
              <SmallCompOriginByEmit
                actionName={customizeData.actionName}
                handleFun={customizeData.handleFun}
              />
            )
          }
          {// 显示最新数据
            config.hasNewData && hasNewData && stockInfo.stockStatus !== 0 && (
              <tspan dx={10}>
                {
                  priceing.map((item, index) =>
                    <ToolTipTSpanLabel key={item.key} dx={15} fill={item.fill}>
                      <SmallCompOrigin
                        actionName={newPriceActionName}
                        handleFun={(data, defaultData) => data.stockStatus === 0? '': `${item.title} ${data[item.key]}`}
                        defaultData=''
                      />
                    </ToolTipTSpanLabel>
                  )
                }
              </tspan>
            )
          }
          {// 内联指标联动
            (currentData || newData) && showByIndLine.length > 0 && (
              tmp = showByIndLine[0].tipConfig,
              <ToolTipTSpanLabel>
                {
                  tmp.label && (
                    <ToolTipTSpanLabel dx={10} fill={labelFill} >
                      {tmp.label(showByIndLine[0].options)}
                    </ToolTipTSpanLabel>
                  )
                }
                {
                  showByIndLine[0].tipConfig.configs.map(config => {
                    let dataTmp = currentData && parentNode.mouseOnChart && currentData[config.key] || newData[config.key];
                    return (
                      <ToolTipTSpanLabel key={config.key} dx={10} fill={config.stroke}>
                        {config.name}: {dataTmp !== undefined && format(`.${dot || 2}f`)(dataTmp) || "--"}
                      </ToolTipTSpanLabel>
                    )
                  })
                }
              </ToolTipTSpanLabel>
            )
          }
				</ToolTipText>
        {// 工具条
          hasTools && [...config.barConfig].reverse().filter(name => Boolean(barConfig[name])).map((name, index) => {
            let item = barConfig[name];
            if(!item)return null;
            let {icon, title} = item;
            switch(name){
              case 'drawer':
                let selectIndex = Number(isShowChartModelRight);
                icon = icon[selectIndex];
                title = title[selectIndex];
                break;
            }
            return (
              <image
                key={name}
                xlinkHref={icon}
                width={fontSize}
                height={fontSize}
                x={chartWidth - offsetLeft * 2 - 15 * (index + 1) - fontSize * index}
                y={fontSize * -1 - barHeight * 0.5}
                cursor="pointer"
                onClick={e => this.operHandler({e, operType: name})}
              >
                <title>{title}</title>
              </image>
            )
          })
        }
      </g>
    )
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

KlineBar.propTypes = {
	className: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,
	config: PropTypes.object,
	newData: PropTypes.object,
  chartCanvasConfig: PropTypes.object,
  hasNewData: PropTypes.bool,
  hasStop: PropTypes.bool,
  hasTools: PropTypes.bool,
  hasCustomize: PropTypes.bool,
  customizeData: PropTypes.object,
  hasName: PropTypes.bool,
};

KlineBar.defaultProps = {
	className: "react-stockcharts-tooltip",
  fontSize: 14,
  labelFill: '#ccc',
  hasNewData: true,
  hasStop: true,
  hasTools: true,
  hasCustomize: false,
  customizeData: {},
  hasName: true,
};

KlineBar = connect(
  state => ({
    isShowChartModelRight: state.DisplayController.isShowChartModelRight,
  }),{ controller, update }
)(KlineBar);

export {KlineBar};

import React, { Component } from 'react';
import './ChartOrigin.less';

import DetailChartOrigin from '../lists/DetailChartOrigin';
import {indexConfig} from '@/components/lists/klineConfig.js';
import ToolTipTSpanLabel from "@/components/react-stockcharts/lib/tooltip/ToolTipTSpanLabel";
import _round from 'lodash/round';
import { format } from "d3-format";

class ChartOrigin extends Component{
  constructor(props){
    super(props);
    this.isFirst = true;
    this.state = {
      Comp: null
    }
    this.symbolMap = {
      'SZ.399001':'SZ.399106',
      'SZ.399005':'SZ.399101',
      'SZ.399006':'SZ.399102',
    }
  }

  splitFn(str) {
    const [symbol, dataType, indexstatdataType] = str.split('-');
    this.actionNames = [`${symbol}-${dataType}`];
    if(indexstatdataType){
      this.actionNames.push(`${symbol}-${indexstatdataType}`);
    }
  }

  componentDidMount() {
    this.isFirst = true;
  }

  defaultSet(index, cycleBarConfig){
    let ans = {showByIndChart: [], showByIndLine: []};
    cycleBarConfig.defaultNorm.forEach(name => {
      console.log(indexConfig);
      let key, config = indexConfig[name];
      switch(config.showType){
        case 'chart':
          key = 'showByIndChart';
          break;
        case 'line':
          key = 'showByIndLine';
          break;
      }
      ans[key].push(config);
    })
    return ans;
  }

  render(){
    this.splitFn(this.props.actionName);
    let barConfig, moreProps = {};
    const {chartType, chartProps, activeIndex=0} = this.props;
    if(chartType === 'fk' || chartType === 'kf'){
      barConfig = chartProps.cycleBarConfig[activeIndex];
    }else if(chartProps.cycleBarConfig.constructor === Array){
      barConfig = chartProps.cycleBarConfig[activeIndex];
    }else if(chartProps.cycleBarConfig.constructor === Object){
      barConfig = chartProps.cycleBarConfig;
      chartProps.cycleBarConfig = (new Array(this.props.tabTitle && this.props.tabTitle.length || 1)).fill(barConfig);
    }
    const hasTitle = this.props.chartProps && this.props.chartProps.title;
    if(this.actionNames[1] && (chartType === 'f' || chartType[this.props.activeIndex] === 'f')){
      let [symbol, dataType] = this.actionNames[1].split('-');
      symbol = this.symbolMap[symbol] || symbol;
      moreProps.hasCustomize = true;
      moreProps.hasName = false;
      let stockInfo = window.codelist.data[symbol];
      moreProps.customizeData = {
        actionName: `${symbol}-${dataType}`,
        handleFun: data => {
          let downOrLow;
          if(data.stockBasic.stockStatus === 0){
            return <tspan className="zero">
              <tspan className="under">停牌中...</tspan>
              <tspan dx="10">{data.close}　{data.netChangeRatio.constructor === String && data.netChangeRatio || `${format('.2f')(data.netChangeRatio)}%`}</tspan>
            </tspan>
          }else{
            // 指数
            downOrLow = data.netChangeRatio === 0? 2: Number(data.netChangeRatio > 0);
            return (
              <tspan className="zero" >
                {
                  dataType !== '17' && <tspan>
                    {data.stockName}
                  </tspan>
                }
                <tspan dx="10" className={['upper', 'under'][downOrLow]}>
                  {`${data.close}　${format('.2f')(data.netChangeRatio)}%　${['▼', '▲', ''][downOrLow]} ${data.netChange}`}
                </tspan>
                {
                  dataType === '17' && <tspan>
                    　涨家
                    <tspan className="under" dx="5">{data.riseNum}</tspan>
                    　跌家
                    <tspan className="upper" dx="5">{data.fallNum}</tspan>
                  </tspan>
                }
                {
                  dataType === '6' && (
                    data.asset === 4 && (
                      <tspan>
                        　涨家
                        <tspan className="under" dx="5">{data.RiseVolume}</tspan>
                        　跌家
                        <tspan className="upper" dx="5">{data.FallVolume}</tspan>
                      </tspan>
                    ) || (
                      <tspan>
                        　现量
                        <tspan className={['upper', 'under'][downOrLow]} dx="5">{data.nowVolume}</tspan>
                        　换手
                        <tspan className={['upper', 'under'][downOrLow]} dx="5">{format('.2f')(data.turnoverRatio)}%</tspan>
                      </tspan>
                    )
                  )
                }
              </tspan>
            )
          }
        }
      };
    }
    return (
      <div className="canvsMain">
        {
            hasTitle && <h2 className="h2title">{this.props.chartProps.title}</h2>
        }
        <div style={{width: '100%', height: hasTitle? 'calc(100% - 28px)': '100%'}}>
          <DetailChartOrigin
            {...this.props}
            actionName={this.actionNames[0]}
            isFirst={false}
            cycleBarConfig={chartProps.cycleBarConfig}
            barConfig={barConfig}
            axisNumY={chartProps.axisNumY}
            sign={this.actionNames[1]}
            {...this.defaultSet(activeIndex, barConfig)}
            barHeight={32}
            klineBarProps={{
              offset: 10,
              fontSize: 10,
              hasTools: false,
              hasNewData: false,
              ...moreProps,
            }}
          />
        </div>
      </div>
    )
  }
}

export default ChartOrigin;

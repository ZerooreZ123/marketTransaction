import React, { Component } from "react";
import echarts from "echarts";

export default class MyCharts extends Component {
  constructor() {
    super();
    this.initChart = this.initChart.bind(this)
  }
  componentDidMount() {
    this.initChart()
  }
  componentWillUpdate() {
    this.initChart()
  }
  initChart() {
    let chart = echarts.init(this.refs.chart);
    chart.setOption(this.props.option.option);
  }
  render() {
    const html =
      <div ref="chart" style={{ width: '100%', height: 400 }}></div>
    return html;
  }
}

import React, { Component } from 'react';
import { CompBaseClass } from "@/utils/BaseTools.js";
import CompGenerater from '@/components/modules/CompGenerater';
import { Resource } from '@/utils/resource'
import { connect } from 'react-redux';
import { glbj } from '@/actions';
import _cloneDeep from 'lodash/cloneDeep';
import echarts from 'echarts'
import { unitConvert } from '@/utils/FormatUtils'
import moment from 'moment';
// import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';


const bigInColor = '#aa1a1a', midInColor = '#c32530', smaInColor = '#d43d44', bigOutColor = '#17815D', midOutColor = '#289D76', smaOutColor = '#3AAf95'
class ZjlxOrigin extends CompBaseClass {
  constructor(props) {
    super(props);
    this.state = {
      actionName: '',
      currentIndex: 0,
    }
    this.tabs = [
      { tabName: "当日" },
      { tabName: "五日" },
    ]
  }
  componentDidMount() {
    this.emitEvent([{ symbol: this.props.quoteDetailsData.uuid, dataType: '15' }, { symbol: this.props.quoteDetailsData.uuid, dataType: '16' }])
    this.renderData && this.pieChartOptional(_cloneDeep(this.renderData))
  }
  componentDidUpdate() {
    this.renderData && this.pieChartOptional(_cloneDeep(this.renderData))
  }

  shouldComponentUpdate(nextProps, nextState) {
    // debugger
    let isEqual = _isEqual;
    let _Action = this.state.currentIndex === 0 ? `${this.props.quoteDetailsData.uuid}-15` : `${this.props.quoteDetailsData.uuid}-16`;
    if (
      nextState.currentIndex !== this.state.currentIndex
      || (this.isLegal(nextProps.data[_Action]) && !isEqual(nextProps.data[_Action], this.renderData))
    ) {
      this.renderTime++;
      return true;
    }
    return false;
  }

  filterData(data) {
    data.bigInflowsScale = parseInt((data.bigInflows / (data.sumInflows + data.sumOutflows)) * 100)
    data.middleInflowsScale = parseInt((data.middleInflows / (data.sumInflows + data.sumOutflows)) * 100)
    data.smallInflowsScale = parseInt((data.smallInflows / (data.sumInflows + data.sumOutflows)) * 100)
    data.bigOutflowsScale = parseInt((data.bigOutflows / (data.sumInflows + data.sumOutflows)) * 100)
    data.middleOutflowsScale = parseInt((data.middleOutflows / (data.sumInflows + data.sumOutflows)) * 100)
    data.smallOutflowsScale = parseInt((data.smallOutflows / (data.sumInflows + data.sumOutflows)) * 100)
    return data;
  }

  renderDom(data) {
    data = this.filterData(data);
    return (
      <div className='lend'>
        <div><label style={{ background: bigInColor }}></label><span>流入大单</span><span className='inFlow'>{data.bigInflowsScale}%</span></div>
        <div><label style={{ background: midInColor }}></label><span>流入中单</span><span className='inFlow'>{data.middleInflowsScale}%</span></div>
        <div><label style={{ background: smaInColor }}></label><span>流入小单</span><span className='inFlow'>{data.smallInflowsScale}%</span></div>
        <div><label style={{ background: bigOutColor }}></label><span>流出大单</span><span className='outFlow'>{data.bigOutflowsScale}%</span></div>
        <div><label style={{ background: midOutColor }}></label><span>流出中单</span><span className='outFlow'>{data.middleOutflowsScale}%</span></div>
        <div><label style={{ background: smaOutColor }}></label><span>流出小单</span><span className='outFlow'>{data.smallOutflowsScale}%</span></div>
      </div>
    )
  }

  pieChartOptional(data) {
    // debugger
    data = this.filterData(data);

    let myChart = echarts.init(document.getElementById('PieChart'));
    myChart.setOption({
      grid: {
        left: '10px',   //距离左边的距离
        right: '10px', //距离右边的距离
        bottom: '20px',//距离下边的距离
        top: '20px' //距离上边的距离
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
              textStyle: {
                align: 'left',
                baseline: 'middle',
                fontFamily: '微软雅黑',
                fontSize: 10,
              }
            },
          },
          color: [bigInColor, midInColor, smaInColor, bigOutColor, midOutColor, smaOutColor],
          data: [
            { value: data.bigInflowsScale, name: '流入大单' },
            { value: data.middleInflowsScale, name: '流入中单' },
            { value: data.smallInflowsScale, name: '流入小单' },
            { value: data.bigOutflowsScale, name: '流出大单' },
            { value: data.middleOutflowsScale, name: '流出中单' },
            { value: data.smallOutflowsScale, name: '流出小单' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  }


  render() {

    // this.renderData = _cloneDeep(this.props.data[`${this.props.quoteDetailsData.uuid}-15`]);
    this.renderData = this.state.currentIndex === 0 ? _cloneDeep(this.props.data[`${this.props.quoteDetailsData.uuid}-15`]) : _cloneDeep(this.props.data[`${this.props.quoteDetailsData.uuid}-16`])
    return (
      <div className='glbjContent'>
        <div className='glbjListLeft'>
          <div className='zjlsListLeft'>
            <div>
              <div className="chartMain">
                {
                  this.tabs.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.setState({ currentIndex: index })}
                        className={index === this.state.currentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res.tabName}
                      </div>
                    )
                  })
                }
              </div>
              {/* moment(`${item.date}${zero}${item.time}`, "YYYYMMDDHHmmss") */}
              <div className="picshow" id="PieChart"></div>
              {
                this.renderData && (
                  <div className='upDate'>数据更新于{moment(`${this.renderData.date}${this.renderData.time = String(this.renderData.time).length === 8 ? '0' + this.renderData.time : this.renderData.time}`, "YYYYMMDDHHmmss").format('YYYY-MM-DD')}</div>
                )
              }
            </div>
            {
              this.renderData && this.renderDom(_cloneDeep(this.renderData))
            }
          </div>
        </div>
        <div className='glbjListRight zjlxListRight'>
          {
            this.renderData && (
              <table border="1">
                <tr>
                  <th></th>
                  <th>流入</th>
                  <th>流出</th>
                  <th>净流入</th>
                </tr>
                <tr>
                  <td>大单</td>
                  <td className='inFlow'>{unitConvert(this.renderData.bigInflows)}</td>
                  <td className='outFlow'>{unitConvert(this.renderData.bigOutflows)}</td>
                  <td>{unitConvert(this.renderData.bigNetInflows)}</td>
                </tr>
                <tr>
                  <td>中单</td>
                  <td className='inFlow'>{unitConvert(this.renderData.middleInflows)}</td>
                  <td className='outFlow'>{unitConvert(this.renderData.middleOutflows)}</td>
                  <td>{unitConvert(this.renderData.middleNetInflows)}</td>
                </tr>
                <tr>
                  <td>小单</td>
                  <td className='inFlow'>{unitConvert(this.renderData.smallInflows)}</td>
                  <td className='outFlow'>{unitConvert(this.renderData.smallOutflows)}</td>
                  <td>{unitConvert(this.renderData.smallNetInflows)}</td>
                </tr>
                <tr>
                  <td>合计</td>
                  <td className='inFlow'>{unitConvert(this.renderData.sumInflows)}</td>
                  <td className='outFlow'>{unitConvert(this.renderData.sumOutflows)}</td>
                  <td>{unitConvert(this.renderData.sumNetInflows)}</td>
                </tr>

              </table>
            )
          }


        </div>
      </div>
    )
  }
}
export default connect(
  state => ({ data: state.Data, quoteDetailsData: state.DisplayController.quoteDetailsData }), { glbj }
)(ZjlxOrigin);

import React, { Component } from "react";
import { Table } from "antd";
import { unitConvert, formDate2,formDate4 } from '@/utils/FormatUtils'
import baseConfig from "@/config/F10Config.js";
import chartConfig from "@/config/F10ChartConfig.js"
import MyChart from "@/components/modules/MyChart.js"
import "./style.less";
import { Resource } from '@/utils/resource';
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';

const PAGEMENU = [{
  name: '评级一览',
  elem: 'pjyl'
}, {
  name: '业绩预测',
  elem: 'yjyc'
}, {
  name: '机构研报',
  elem: 'jgyb'
}]

class ValuationForecast extends Component {
  constructor() {
    super();
    this.state = {
      posid:0,
      menuCurrentIndex: 0,
      forecastData:{},
      dataResult: [],
      dataRoe: [],
      dataFc: [],
      newsList: [],
      HZTitle: [],
      HZDetail: [],
      Config: chartConfig,
    }
  }
  componentDidMount() {
    this.RrpRptRatStat();
    this.IvstEstBsc();
    this.IvstEstTot();
    this.ZxTxtNwsLstComs()
  }
  componentDidUpdate() {
    this.getHeightList()
  }
  getHeightList() {
    this.dlList = document.getElementsByTagName("dl");
    this.dlList[0].classList.add('active');
    this.heightList = [];
    let heightListInit = [];
    let heightSum = 0;
    PAGEMENU.map((item, index, arr) => {
      let anchorElementHeight = document.getElementById(item.elem).offsetHeight;
      heightListInit.push(anchorElementHeight)
    })
    heightListInit.map((item, index) => {
      heightSum += item;
      this.heightList.push(heightSum)
    })
  }

  scrollToActive() {
    let scrollTop = document.getElementById('scrollContent').scrollTop;
    let offsetHeight = document.getElementById('scrollContent').offsetHeight
    this.heightList.some((item, index, array) => {
      if (scrollTop + offsetHeight / 2 < item) {
        PAGEMENU.map((item, index) => {
          if (this.dlList[index].className === 'active') {
            this.dlList[index].classList.remove('active');
          }
        })
        if (scrollTop === 0) {
          this.dlList[0].classList.add('active');
        } else if (offsetHeight + scrollTop === array[this.heightList.length - 1]) {
          this.dlList[PAGEMENU.length - 1].classList.add('active');
        } else {
          this.dlList[index].classList.add('active');
        }
        return true;
      }
    })

  }
  scrollToAnchor(anchorName, index) {
    this.ScrollTop(this.heightList[index - 1], 240);
  }

  ScrollTop(number = 0, time) {
    if (!time) {
      document.getElementById('scrollContent').scrollTop = number;
      return number;
    }
    const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime; // 计算循环的次数
    let nowTop = document.getElementById('scrollContent').scrollTop; // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
    let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--;
        this.ScrollTop(nowTop += everTop);
      } else {
        clearInterval(scrollTimer); // 清除计时器
      }
    }, spacingTime);
  };
  IvstEstTot() { // 业绩预测汇总
    Resource.IvstEstTot.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      let chartResult = JSON.parse(JSON.stringify(data)).slice(data.length - 8);
      let Result = data.slice(data.length-3);
      let roe = [];
      let fc = [];
      let chartData = {
        yearNum: [],
        net_prof: [],
        eps_bas: [],
        fc_lr: [],
        fc_sy: [],
      }
      chartResult.forEach(item => {
        chartData.yearNum.push(item.fc_y);
        if (item.is_pub === 'Y') {
          chartData.net_prof.push(item.net_prof/1e8)// 利润
          chartData.eps_bas.push(item.eps_bas.toFixed(2))   // 每股收益
        }
        if (item.is_pub === "N") {
          chartData.fc_lr.push(item.avg_fc_num/1e8);  // 预测净利润
          chartData.fc_sy.push(item.avg_roe_num.toFixed(2)) // 预测每股收益平均值
        }
      })
      Result.forEach(item => {
        roe.push({
          year: item.fc_y,
          num: item.org_count,
          max: item.max_roe_num.toFixed(2),
          avg: item.avg_roe_num.toFixed(2),
          min: item.min_roe_num.toFixed(2)
        })
        fc.push({
          year: item.fc_y,
          num: item.org_count,
          max: unitConvert(item.max_fc_num),
          avg: unitConvert(item.avg_fc_num),
          min: unitConvert(item.min_fc_num)

        })
      })
      let dataLength = chartData.net_prof.length;
      let dataArray = Array.from({ length: dataLength }, (v, k) => '');
      dataArray.unshift(0, 0);
      Array.prototype.splice.apply(chartData.fc_lr, dataArray);
      Array.prototype.splice.apply(chartData.fc_sy, dataArray);
      chartConfig.option.xAxis[0].data = chartData.yearNum;
      chartConfig.option.series[0].data = chartData.net_prof;
      chartConfig.option.series[1].data = chartData.fc_lr;
      chartConfig.option.series[2].data = chartData.eps_bas;
      chartConfig.option.series[3].data = chartData.fc_sy;
      const chart = JSON.parse(JSON.stringify(chartConfig))
      this.setState({ dataRoe: roe, dataFc: fc, Config: chart });
    }).catch(err => {
    })
  }
  IvstEstBsc() { // 业绩预测明细
    Resource.IvstEstBsc.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      const Fc = [];  // 预测每股收益年份
      const Roe = []; // 预测净利润年份
      let R = []  // 填充年份后的表格数据
      let forecast = {
        date:formDate4(data.lastdt),
        num:data.orgcnt
      }
      data.yearlist.forEach(item => {
        Fc.push({
          title: item,
          width:70,
          dataIndex: 'shr_exp_' + item,
         
        })
        Roe.push({
          title: item,
          width:80,
          dataIndex: 'fc_num_' + item,
        })
      })
      const SY = {
        title:'预测每股收益',
        children: Fc
      }
      const LiR = {
        title:'预测净利润',
        children: Roe
      }
      const yearList = Fc.reverse().concat(Roe.reverse());
      let titleTable = [{
        title: "预测机构",
        width: 100,
        dataIndex: "org_name_sht",
      },
      {
        title: "预测日期",
        width: 100,
        dataIndex: "over_dt",
      },SY,LiR,
       {
        title: "分析师",
        width: 120,
        dataIndex: "aut",
      }]
      let Resource = [];
      Resource = data.datalist.concat();
      
      yearList.forEach(item=>{
        
        R.push(item.dataIndex)
      })
      // debugger
      const T = []
      R.map((e,i)=>{
        Resource.map((item,index)=>{
          if(item.hasOwnProperty(e)) {
            if(e.slice(0,6) === 'fc_num'){
              item[e]= unitConvert(item[e])
            }else{
              item[e] = item[e].toFixed(2)
            }
          }
          if(!item.hasOwnProperty(e)) {
            item[e]= '--'
          }
        })
      })
      Resource.map(item=>{
        item.over_dt = formDate4(item.over_dt)
      }) 
      this.setState({ HZTitle: titleTable, HZDetail: Resource,forecastData:forecast})
    }).catch(err => {
    })
  }
  RrpRptRatStat() { // 评级一览
    Resource.RrpRptRatStat.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      let Result = [];
      data.forEach(item => {
        Result.push({
          pjzq: item.stat_name,
          zhpj: item.rat_desc,
          hj: item.sum_num,
          mr: item.buy_rpt_num,
          zc: item.incr_agy_num,
          zx: item.neut_rpt_num,
          jx: item.redu_rpt_num,
          mc: item.sell_rpt_num
        })
      })
      this.setState({ dataResult: Result })
    }).catch(err => {
    })
  }
  ZxTxtNwsLstComs() { // 机构研报
    Resource.ZxRrpRptAlls.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.state.posid}/10`).then((data) => {
      const dataResult = data.datalist
      dataResult.map(item => {
        item.name = 'DetailNewsPaper'
        item.pub_dt = formDate2(item.pub_dt)
      });
      this.setState({ newsList: dataResult })
    }).catch(err => {
    })
  }
  render() {
    // affix={false}
    const { dataResult, dataFc, dataRoe, newsList, HZTitle, HZDetail, Config ,forecastData} = this.state;
    return (
      <div className="F10content gzyc">
        <div className="contentLeft">
          {/* <Anchor target={() => document.querySelector('#container')}>
            <Link href="#pjyl" title="评级一栏" />
            <Link href="#yjyc" title="业绩预测" />
            <Link href="#jgyb" title="机构研报" />
          </Anchor> */}
           {
            PAGEMENU.map((item, index) => {
              return (
                <dl key={index} className={index === this.state.menuCurrentIndex ? 'active' : ''}>
                  <dt>{index + 1}</dt>
                  <dd onClick={(e) => this.scrollToAnchor(item.elem, index)}>{item.name}</dd>
                </dl>
              )
            })
          }
        </div>
        <div className="contentRight" id="scrollContent" onScroll={(e) => this.scrollToActive(e)}>
          <div className="rightList" id="pjyl">
            <h2>评级一览</h2>
            <div className="picshow">
              <Table
                pagination={baseConfig.pjylTable.pagination}
                columns={baseConfig.pjylTable.columns}
                locale = {{emptyText:'暂无数据'}}
                dataSource={dataResult}
                // className="tableList"
              />
            </div>
          </div>
          <div className="rightList" id="yjyc">
            <h2>业绩预测</h2>
            <div className="kgcjyj">
              <span>
                截止{forecastData.date}，6个月以内共{forecastData.num}家机构对{this.props.f10Data.stockName}作出业绩预测
              </span>
            </div>
            <div className="rightListMain">
              <MyChart option={Config} />
            </div>
            <div className="huizong">
              <div className="left">
                <p>
                  汇总-预测年报每股收益 <span>单位：元</span>
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>年度</th>
                      <th>预测机构数</th>
                      <th>最小值</th>
                      <th>均值</th>
                      <th>最大值</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dataRoe.map((item, index) =>
                        <tr key={index}>
                          <td>{item.year}</td>
                          <td>{item.num}</td>
                          <td>{item.min}</td>
                          <td>{item.avg}</td>
                          <td>{item.max}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
              <div className="right">
                <p>
                  汇总-预测年报净利润<span>单位：元</span>
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>年度</th>
                      <th>预测机构数</th>
                      <th>最小值</th>
                      <th>均值</th>
                      <th>最大值</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dataFc.map((item, index) =>
                        <tr key={index}>
                          <td>{item.year}</td>
                          <td>{item.num}</td>
                          <td>{item.min}</td>
                          <td>{item.avg}</td>
                          <td>{item.max}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="picshow">
             <div className="box">
              <Table
                  pagination={baseConfig.yjycmxTable.pagination}
                  columns={HZTitle}
                  dataSource={HZDetail}
                  scroll={{y:400}}
                  locale = {{emptyText:'暂无数据'}}
                  // size="middle"
                  className="tableList"
                />
             </div>
            </div>
          </div>
          <div className="rightList" id="jgyb">
            <h2>机构研报</h2>
            <div className="newsBulletin">
              <div className="list">
                <ul>
                  {
                    newsList.map((item, index) =>
                      <li className="flex-wrap-between" key={index} onClick={e => this.props.controller({ isShowNewsDetails: true, newsDetailsData: item })}>
                        <div>{item.tit}</div>
                        <div>{item.pub_dt}</div>
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
            <a onClick={e => this.props.controller({ isShowF10NewsListMore: true, F10NewsListMoreData: { defaultActiveKey: '2' } })}>查看更多>></a>
          </div>
        </div>
      </div>
    );
  }
}

export default F10WrappedComponent(ValuationForecast);
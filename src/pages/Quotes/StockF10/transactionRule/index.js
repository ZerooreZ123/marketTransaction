import React, { Component } from "react";
import { Table, Timeline, DatePicker, Tabs, LocaleProvider } from "antd";
import moment from "moment";
import baseConfig from "@/config/F10Config.js";
import "./style.less";
import { Resource } from '@/utils/resource';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { unitConvert, getMonthYestdy, getBasSpclNtcTypeCode, formDate2 } from '@/utils/FormatUtils'
// import BubbleChart from '@/components/socketChart/BubbleChart'
// import BarChart from '@/components/socketChart/BarChart'
import { getData } from "@/components/socketChart/utils"
import echarts from 'echarts'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';
// import F10NewsDetails from '@/pages/Quotes/StockF10/F10NewsDetails';


const { RangePicker } = DatePicker;
const dateFormat = "YYYYMMDD";
const TabPane = Tabs.TabPane;
const zjlxTabs = [
  { tabName: "最近一个月" },
  { tabName: "最近三个月" },
  { tabName: "最近六个月" },
  { tabName: "最近一年" },
  { tabName: "最近两年" },
]
const rzrqTabs = [
  { tabName: "最近一个月" },
  { tabName: "最近三个月" },
  { tabName: "最近六个月" },
  { tabName: "最近一年" },
  { tabName: "最近两年" },
]

const PAGEMENU = [{
  name: '最新指标',
  elem: 'zxzb'
}, {
  name: '事件总览',
  elem: 'sjzl'
}, {
  name: '大宗交易',
  elem: 'dzjy'
}, {
  name: '资金流向',
  elem: 'zjlx'
}, {
  name: '龙虎榜',
  elem: 'lhb'
}, {
  name: '融资融券',
  elem: 'rzrq'
}, {
  name: '新闻公告',
  elem: 'xwgg'
}, {
  name: '违规处理',
  elem: 'wgcl'
}]


const ZJLXMENU = [
  {
    name: '主力净流入',
    type: 'main_mny_net_inArr'
  }, {
    name: '超大单净额',
    type: 'huge_net_inArr'
  }, {
    name: '大单净额',
    type: 'big_net_inArr'
  }, {
    name: '中单净额',
    type: 'mid_net_inArr'
  }, {
    name: '小单净额',
    type: 'small_net_inArr'
  },
]


class TransactionRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posid: 0,
      asset: '',
      flag: 0,
      ZxTxtNwsLstComsArr: '',
      ZxTxtAnnCentersArr: '',
      menuCurrentIndex: 0,
      zjlxCurrentIndex: 0,
      zjlxTypeCurrentIndex: 0,
      rzrqCurrentIndex: 0,
      newIdxValData: {},
      basSpclNtcDataArr: [],
      stkcnBlkTrdDataArr: [],
      stkcnMnyFlowDataArr: [],
      stkcnAbnTrdDataArr: [],
      smtcnExchTrdDetDataArr: [],
      otbIllBasDataArr: [],
      ZxTxtNwsLstComsDataArr: [],
      zjlxDate: {
        starDate: getMonthYestdy(1, 0),
        endDate: getMonthYestdy(0, 0),
      },
      rzrqDate: {
        starDate: getMonthYestdy(1, 0),
        endDate: getMonthYestdy(0, 0),
      },
      dzjypagination: {
        pageIndex: 1,
        pageSize: 10,
        loading: false
      },
      zjlxpagination: {
        loading: false,
      },
      rzrqpagination: {
        loading: false,
      },
      scrollId: '',
    }
    this.zjlxChartData = {};
    this.heightList = [];
  }
  componentDidMount() {
    getData().then(data => {
      this.setState({ data })
    })

    this.NewIdxValService();
    this.BasSpclNtcService();
    this.StkcnBlkTrdService();
    this.StkcnAbnTrdService();
    this.SmtcnExchTrdDetService();
    this.OtbIllBasService();
    this.ZxTxtNwsLstComsService();
    this.ZxTxtAnnCentersService();
    this.StkcnMnyFlowService();
    this.basTimeArr = [];
    this.baseEvtNameArr = [];
    this.tickValueArr = [];
  }

  NewIdxValService() {
    Resource.NewIdxVal.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('最新指标', data)
      for (var k in data) {
        data[k] = unitConvert(parseFloat(data[k]));
      }
      this.setState({ newIdxValData: data })
    }).catch(err => {

    })
  }
  BasSpclNtcService() {
    Resource.BasSpclNtc.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('事件总览', data)
      let echartsArr = [];
      data.map((item, index, arr) => {
        item.evt_time1 =  (item.evt_time).substr(4, 2) + '月' + (item.evt_time).substr(6, 2) + '日'
        item.evt_time2 = (item.evt_time).substr(0, 4) + "" + (item.evt_time).substr(4, 2) + '' + (item.evt_time).substr(6, 2);
        item.evt_time = moment(item.evt_time + '0000000', 'YYYYMMDDHHmmss').toDate();
        item.evt_typ_code_init = item.evt_typ_code > 10 ? item.evt_typ_code - 5 : item.evt_typ_code;
        if (item.evt_typ_code_init === 26) item.evt_typ_code_init = item.evt_typ_code_init - 9;
        if (this.baseEvtNameArr.indexOf(item.evt_typ_code) > -1) {
        } else {
          this.baseEvtNameArr.push(item.evt_typ_code)
          this.tickValueArr.push(index)
        }
        if (index === 0) {
          item.showTime = true;
        } else {
          if (data[index].evt_time1 === data[index - 1].evt_time1) {
            item.showTime = false;
          } else {
            item.showTime = true;

          }
        }
        item.scrollId = 'scroll_' + item.evt_time2 + '_' + item.evt_typ_code_init;
        this.basTimeArr.push(item.evt_time)
        echartsArr.push([item.evt_time, item.evt_typ_code_init])
      })
      this.bubbleChartOptional(echartsArr, this)
      this.setState({ basSpclNtcDataArr: data })
    }).catch(err => {

    })
  }
  StkcnBlkTrdService() {
    const dzjypagination = { ...this.state.dzjypagination };
    this.setState({
      dzjypagination: {
        loading: true
      }
    })
    Resource.StkcnBlkTrd.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${dzjypagination.pageIndex}/${dzjypagination.pageSize}`).then((data) => {
      console.log('大宗交易', data)
      dzjypagination.total = data.totalCnt;
      data.datalist.map((item, index) => {
        item.tnv_val = unitConvert(item.tnv_val, 1)
        item.tnv_vol = unitConvert(item.tnv_vol, 1)
      })
      this.setState({
        stkcnBlkTrdDataArr: data.datalist,
        dzjypagination,
      })
    }).catch(err => {

    })
  }
  StkcnAbnTrdService() {
    Resource.StkcnAbnTrd.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('龙虎榜', data)
      data.map(item => {
        item.buy_list.map(ii => {
          ii.buy_val = unitConvert(ii.buy_val, 1)
          ii.tnv_val = unitConvert(ii.tnv_val, 1)
          ii.sell_val = ('0.00')
          ii.sell_rat = ('0.00')
        })
        item.sell_list.map(ii => {
          ii.buy_val = ('0.00')
          ii.buy_rat = ('0.00')
          ii.sell_val = unitConvert(ii.sell_val, 1)
          ii.tnv_val = unitConvert(ii.tnv_val, 1)
        })
      })
      this.setState({ stkcnAbnTrdDataArr: data })
    }).catch(err => {

    })
  }
  SmtcnExchTrdDetService() {
    this.setState({
      rzrqpagination: {
        loading: true
      }
    })
    Resource.SmtcnExchTrdDet.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.state.rzrqDate.starDate}/${this.state.rzrqDate.endDate}`).then((data) => {
      // console.log('融资融券', data)
      // let cls_prcArr = [];//股票价格
      // let trd_dtArr = [];
      // data.map((item,index) =>{
      // cls_prcArr.push(item.trd_dt,item.cls_prc)
      // cls_prcArr = Array.from(data,({trd_dt,cls_prc}) => ([trd_dt,cls_prc]))


      // data.map((item, index) => {
      //   for (var k in item) {
      //     if (k === 'trd_dt') {
      //       item[k] = item[k];
      //     } else {
      //       item[k] = unitConvert((item[k]))
      //     }
      //   }
      // })
      let trd_dtArr = Array.from(data, ({ trd_dt }) => (trd_dt))
      let cls_prcaArr = Array.from(data, ({ cls_prc }) => (parseFloat(cls_prc)))
      let fin_valArr = Array.from(data, ({ fin_val }) => (parseFloat(fin_val)))//融资余额
      let fin_buy_valArr = Array.from(data, ({ fin_buy_val }) => (parseFloat(fin_buy_val)))//融资买入额(元)	
      let secu_sell_volArr = Array.from(data, ({ secu_sell_vol }) => (parseFloat(secu_sell_vol)))//融券卖出量(股)
      let secu_valArr = Array.from(data, ({ secu_val }) => (parseFloat(secu_val)))//融券余额(元)
      let secu_volArr = Array.from(data, ({ secu_vol }) => (parseFloat(secu_vol)))//融券余量(股)
      let ttl_valArr = Array.from(data, ({ ttl_val }) => (parseFloat(ttl_val)))//融券余量(股)
      let _data = { trd_dtArr, cls_prcaArr, fin_valArr, fin_buy_valArr, secu_sell_volArr, secu_valArr, secu_volArr, ttl_valArr }
      data.map(item => {
        item.cls_prc = unitConvert(item.cls_prc, 1)
        item.fin_val = unitConvert(item.fin_val, 1)
        item.fin_buy_val = unitConvert(item.fin_buy_val, 1)
        item.secu_sell_vol = unitConvert(item.secu_sell_vol, 1)
        item.secu_val = unitConvert(item.secu_val, 1)
        item.secu_vol = unitConvert(item.secu_vol, 1)
        item.ttl_val = unitConvert(item.ttl_val, 1)
      })
      this.setState({
        rzrqpagination: {
          loading: false
        }
      })
      this.setState({ smtcnExchTrdDetDataArr: data })
      // debugger
      this.lineChartOptional(_data)
    }).catch(err => {

    })
  }

  serviceNewsDataCallBack(data, type) {
    console.log('列表数据', data)
    // debugger
    data.map(item => {
      item.name = 'DetailNewsLeft'
      item.pub_time = formDate2(item.pub_time)
    });
    if (data.length > 0) {
      if (type === 'ZxTxtNwsLstComs') {
        let _ZxTxtNwsLstComsArr = [...this.state.ZxTxtNwsLstComsArr, ...data]
        this.setState(prev => {
          return {
            ...prev,
            ZxTxtNwsLstComsArr: _ZxTxtNwsLstComsArr,
            flag: '0',
            posid: data[data.length - 1].posid
          }
        })
      } else {
        let _ZxTxtAnnCentersArr = [...this.state.ZxTxtAnnCentersArr, ...data]
        this.setState(prev => {
          return {
            ...prev,
            ZxTxtAnnCentersArr: _ZxTxtAnnCentersArr,
            flag: '0',
            posid: data[data.length - 1].posid
          }
        })
      }
    } else {
      this.setState(prev => {
        return {
          ...prev,
          flag: '1',
        }
      })
    }


  }

  OtbIllBasService() {
    Resource.OtbIllBas.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('违规处理', data)
      this.setState({ otbIllBasDataArr: data })
    }).catch(err => {

    })
  }
  ZxTxtNwsLstComsService() {
    Resource.ZxTxtNwsLstComs.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.state.posid}/10/0`).then((data) => {
      console.log('新闻', data)
      data = data.datalist;
      this.serviceNewsDataCallBack(data, 'ZxTxtNwsLstComs')
    }).catch(err => { })
  }

  ZxTxtAnnCentersService() {
    Resource.ZxTxtAnnCenters.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.state.posid}/10/0`).then((data) => {
      console.log('公告', data)
      data = data.datalist;
      this.serviceNewsDataCallBack(data, 'ZxTxtAnnCenters')
    }).catch(err => { })
  }

  StkcnMnyFlowService() {
    this.setState({
      zjlxpagination: {
        loading: true
      }
    })
    Resource.StkcnMnyFlow.post({ begindate: this.state.zjlxDate.starDate, enddate: this.state.zjlxDate.endDate }, '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      // console.log('资金流向', data)
      this.setState({
        zjlxpagination: {
          loading: false
        }
      })
      let main_mny_net_inArr = [];
      let huge_net_inArr = [];
      let big_net_inArr = [];
      let mid_net_inArr = [];
      let small_net_inArr = [];
      let trd_dtArr = [];
      let cls_prcArr = [];

      data.map(item => {
        item.main_mny_net_in = (item.main_mny_net_in).toFixed(2)
        item.huge_net_in = (item.huge_net_in).toFixed(2)
        item.big_net_in = (item.big_net_in).toFixed(2)
        item.mid_net_in = (item.mid_net_in).toFixed(2)
        item.small_net_in = (item.small_net_in).toFixed(2)

        item.date = moment(item.trd_dt, "YYYYMMDD").toDate();
        trd_dtArr.push(item.trd_dt)
        cls_prcArr.push(item.cls_prc)
        main_mny_net_inArr.push(item.main_mny_net_in)
        huge_net_inArr.push(item.huge_net_in);
        big_net_inArr.push(item.big_net_in);
        mid_net_inArr.push(item.mid_net_in);
        small_net_inArr.push(item.small_net_in);
      })
      this.zjlxChartData = { main_mny_net_inArr, huge_net_inArr, big_net_inArr, mid_net_inArr, small_net_inArr, trd_dtArr, cls_prcArr }
      this.barChartOptional(ZJLXMENU[0], this.zjlxChartData.main_mny_net_inArr, this.zjlxChartData.trd_dtArr, this.zjlxChartData.cls_prcArr)
      this.setState({ stkcnMnyFlowDataArr: data })
    }).catch(err => {

    })
  }
  zjlxDateChose(date) {
    this.setState({ zjlxCurrentIndex: -1 })
    this.setState(prevState => {
      prevState.zjlxDate.starDate = date[0].format('YYYYMMDD');
      prevState.zjlxDate.endDate = date[1].format('YYYYMMDD');
      return prevState;
    }, () => {
      this.StkcnMnyFlowService()
    })
  }
  rzrqDateChose(date) {
    this.setState({ rzrqCurrentIndex: -1 })
    this.setState(prevState => {
      prevState.rzrqDate.starDate = date[0].format('YYYYMMDD');
      prevState.rzrqDate.endDate = date[1].format('YYYYMMDD');
      return prevState;
    }, () => {
      this.SmtcnExchTrdDetService()
    })
  }

  //资金流向tab
  zjlxChangeDate(index) {
    this.setState({ zjlxCurrentIndex: index })
    switch (Number(index)) {
      case 0:
        this.setState(prevState => {
          prevState.zjlxDate.starDate = getMonthYestdy(1, 0);

          return prevState;
        }, () => {
          this.StkcnMnyFlowService()
        })
        break;
      case 1:
        this.setState(prevState => {
          prevState.zjlxDate.starDate = getMonthYestdy(3, 0);
          return prevState;
        }, () => {
          this.StkcnMnyFlowService()
        })
        break;
      case 2:
        this.setState(prevState => {
          prevState.zjlxDate.starDate = getMonthYestdy(6, 0);
          return prevState;
        }, () => {
          this.StkcnMnyFlowService()
        })
        break;
      case 3:
        this.setState(prevState => {
          prevState.zjlxDate.starDate = getMonthYestdy(0, 1);
          return prevState;
        }, () => {
          this.StkcnMnyFlowService()
        })
        break;
      case 4:
        this.setState(prevState => {
          prevState.zjlxDate.starDate = getMonthYestdy(0, 2);
          return prevState;
        }, () => {
          this.StkcnMnyFlowService()
        })
        break;
    }

  }
  rzrqChangeDate(index) {
    this.setState({ rzrqCurrentIndex: index })
    switch (Number(index)) {
      case 0:
        this.setState(prevState => {
          prevState.rzrqDate.starDate = getMonthYestdy(1, 0);

          return prevState;
        }, () => {
          this.SmtcnExchTrdDetService()
        })
        break;
      case 1:
        this.setState(prevState => {
          prevState.rzrqDate.starDate = getMonthYestdy(3, 0);
          return prevState;
        }, () => {
          this.SmtcnExchTrdDetService()
        })
        break;
      case 2:
        this.setState(prevState => {
          prevState.rzrqDate.starDate = getMonthYestdy(6, 0);
          return prevState;
        }, () => {
          this.SmtcnExchTrdDetService()
        })
        break;
      case 3:
        this.setState(prevState => {
          prevState.rzrqDate.starDate = getMonthYestdy(0, 1);
          return prevState;
        }, () => {
          this.SmtcnExchTrdDetService()
        })
        break;
      case 4:
        this.setState(prevState => {
          prevState.rzrqDate.starDate = getMonthYestdy(0, 2);
          return prevState;
        }, () => {
          this.SmtcnExchTrdDetService()
        })
        break;
    }

  }


  //大宗交易页面
  dzjyChangePage(page, pageSize) {
    this.setState(prevState => {
      prevState.dzjypagination.pageIndex = page.current;
    }, _ => { this.StkcnBlkTrdService() })

  }


  //散点图
  bubbleChartOptional(data, that) {
    let myChart = echarts.init(document.getElementById('BubbleChart'));
    myChart.setOption({
      grid: {
        left: '80px',   //距离左边的距离
        right: '80px', //距离右边的距离
        bottom: '50px',//距离下边的距离
        top: '40px' //距离上边的距离
      },
      xAxis: [{
        // show: true,
        position: 'top',
        offset: 10,
        splitLine: { show: false },//去除网格线
        type: 'time',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#d8dfeb'
          }
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: function (value) {
            return moment().format("YYYY年MM月DD日");
          }
        }
      }],
      yAxis: [{
        type: 'value',
        interval: 1,
        axisTick: {//决定是否显示坐标刻度  
          alignWithLabel: false,
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#d8dfeb'
          }
        },
        axisLabel: {
          formatter: function (val) {
            return getBasSpclNtcTypeCode(val).name;
          }

        }
      }],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
          height: 20,//组件高度
          textStyle: false
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty',
          textStyle: false
        }
      ],
      series: [{
        symbolSize: 20,
        color: function (value) {
          let _color = getBasSpclNtcTypeCode(value.data[1]).color;
          return _color;
        },
        data: data,
        type: 'scatter'
      }]
    });

    myChart.on('click', function (params) {
      if (that.state.scrollId) document.getElementById(that.state.scrollId).style.color = '#d8dfeb'
      let scrollId = 'scroll_' + moment(params.data[0]).format('YYYYMMDD') + '_' + params.data[1];
      that.setState({ scrollId: scrollId })
      if (scrollId) {
        let anchorElement = document.getElementById(scrollId);
        anchorElement.style.color = '#d69f65'
        if (anchorElement) { anchorElement.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  }


  //柱状图
  barChartOptional(item, main_mny_net_inArr, trd_dtArr, cls_prcArr) {
    let myChart = echarts.init(document.getElementById('barChart'));
    myChart.setOption({
      animation: true,
      // legend: {
      //   data: ['资金'],
      //   align: 'left',
      //   left: 10
      // },
      grid: {
        left: '50px',   //距离左边的距离
        right: '50px', //距离右边的距离
        bottom: '50px',//距离下边的距离
        top: '40px' //距离上边的距离
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'cross'
        // },
        backgroundColor: 'rgba(2, 12, 42, 0.5)',
        formatter: function (param) {
          // debugger
          console.log("param", param)
          return [
            param[0].axisValue + '<br/>',
            param[0].marker + param[0].seriesName + ':' + param[0].value + '万元' + '<br/>',
            param[1].marker + param[1].seriesName + ':' + param[1].value + '元' + '<br/>',
          ].join('');
        }
      },
      xAxis: {
        data: trd_dtArr,
        type: 'category',
        splitLine: {
          show: false,
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#d8dfeb'
          }
        }
      },
      yAxis: [{
        name: '单位:万元',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#d8dfeb'
        },
        data: main_mny_net_inArr,
        // inverse: true,
        position: 'left',
        splitArea: { show: false },
        nameTextStyle: {
          color: '#d8dfeb'
        },
        type: 'value',
        splitLine: {
          show: false,
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#d8dfeb'
          }
        },
        scale: true,/*按比例显示*/
      }, {
        name: '单位:元',
        nameLocation: 'start',
        nameTextStyle: {
          color: '#d8dfeb'
        },
        data: cls_prcArr,
        inverse: true,
        position: 'right',
        splitArea: { show: false },
        type: 'value',
        splitLine: {
          show: false,
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#d8dfeb'
          }
        },
        scale: true,/*按比例显示*/
      }],
      series: [
        {
          name: item.name,
          type: 'bar',
          data: main_mny_net_inArr,
          color: function (value) {
            let _color = value.data > 0 ? '#ef232a' : '#14b143'
            return _color;
          },
        }, {
          name: '个股价格',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          yAxisIndex: 1,
          data: cls_prcArr,
          type: 'line',
          color: '#fff',
          itemStyle: {
            normal: {
              color: "#d69f65",
              lineStyle: {
                width: 1,
                color: "#d69f65"
              }
            }
          }
        },

      ]
    });
  }

  //折线图trd_dtArr,cls_prcaArr,fin_valArr,fin_buy_valArr,secu_sell_volArr,secu_valArr,secu_volArr
  lineChartOptional(data) {
    let myChart = echarts.init(document.getElementById('lineChart'));
    myChart.setOption({
      animation: true,
      tooltip: {
        trigger: 'axis',
        formatter: function (datas) {
          var res = datas[0].name + '<br/>'
          for (var i = 0, length = datas.length; i < length; i++) {
            let _label = datas[i].seriesIndex === 4 ? '股' : '元';
            if (!!datas[i].value) {
              res += datas[i].marker + datas[i].seriesName + '：'
                + unitConvert(datas[i].value, 1) + _label + '<br/>'
            }
          }
          return res
        }
        // axisPointer: {
        //   type: 'cross',
        //   label: {
        //     backgroundColor: '#6a7985'
        //   }
        // }
      },
      legend: {
        data: ['融资余额', '融资买入额', '融券卖出量', '融券余额', '融券余量', '融资融券余额', '价格'],
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        textStyle: {
          color: '#d8dfeb'
        }
      },
      grid: {
        left: '50px',   //距离左边的距离
        right: '200px', //距离右边的距离
        bottom: '50px',//距离下边的距离
        top: '40px' //距离上边的距离
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#1d2c53'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#d8dfeb'
          }
        },
        data: data.trd_dtArr
      },
      yAxis: [
        {
          type: 'value',
          name: '单位：价格',
          position: 'left',
          // nameLocation: 'start',
          nameTextStyle: {
            color: '#d8dfeb'
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#1d2c53'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#d8dfeb'
            }
          },
          data: data.cls_prcaArr
        }, {
          type: 'value',
          name: '',
          show: true,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            textStyle: {
              color: '#d8dfeb'
            }
          },
          data: data.fin_valArr
        }, {
          type: 'value',
          name: '融资买入额',
          offset: 20,
          show: false,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          data: data.fin_buy_valArr
        }, {
          type: 'value',
          name: '融券卖出量',
          offset: 40,
          show: false,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          data: data.secu_sell_volArr
        }, {
          type: 'value',
          name: '融券余额',
          offset: 60,
          show: false,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          data: data.secu_valArr
        }, {
          type: 'value',
          name: '融券余量',
          offset: 80,
          show: false,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          data: data.secu_volArr
        }, {
          type: 'value',
          name: '融资融券余额',
          offset: 100,
          show: false,
          position: 'right',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#1d2c53'
            }
          },
          data: data.ttl_valArr
        }],
      series: [

        {
          yAxisIndex: 1,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          showSymbol: false,
          name: '融资余额',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#c2892f",
              lineStyle: {
                width: 1,
                color: "#c2892f"
              }
            }
          },
          stack: '总量',
          data: data.fin_valArr
        },
        {
          yAxisIndex: 2,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          name: '融资买入额',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#1a4b95",
              lineStyle: {
                width: 1,
                color: "#1a4b95"
              }
            }
          },
          stack: '总量',
          data: data.fin_buy_valArr
        },
        {
          yAxisIndex: 3,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          name: '融券卖出量',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#a1211e",
              lineStyle: {
                width: 1,
                color: "#a1211e"
              }
            }
          },
          stack: '总量',
          data: data.secu_sell_volArr
        },
        {
          yAxisIndex: 4,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          name: '融券余额',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#1795a4",
              lineStyle: {
                width: 1,
                color: "#1795a4"
              }
            }
          },
          stack: '总量',
          data: data.secu_valArr
        },
        {
          yAxisIndex: 5,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          name: '融券余量',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#ce651f",
              lineStyle: {
                width: 1,
                color: "#ce651f"
              }
            }
          },
          stack: '总量',
          data: data.secu_volArr
        },
        {
          yAxisIndex: 6,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          name: '融资融券余额',
          type: 'line',
          itemStyle: {
            normal: {
              color: "#6c65cb",
              lineStyle: {
                width: 1,
                color: "#6c65cb"
              }
            }
          },
          stack: '总量',
          data: data.ttl_valArr
        },
        {
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 1,
          smooth: true,
          yAxisIndex: 0,
          name: '价格',
          type: 'line',
          stack: '价格',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#163565'
              }, {
                offset: 1,
                color: '#163565'
              }])
            }
          },
          itemStyle: {
            normal: {
              color: "#396ebe",
              lineStyle: {
                width: 1,
                color: "#396ebe"
              }
            }
          },
          data: data.cls_prcaArr,
        }
      ]
    });
  }

  sjzlClick(item) {
    if (this.state.scrollId) document.getElementById(this.state.scrollId).style.color = '#d8dfeb'
    this.setState({ scrollId: item.scrollId })
    document.getElementById(item.scrollId).style.color = '#d69f65'

  }
  zjlxClick(item, index) {
    this.setState({ zjlxTypeCurrentIndex: index })
    this.barChartOptional(item, this.zjlxChartData[item.type], this.zjlxChartData.trd_dtArr, this.zjlxChartData.cls_prcArr)
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

  getHeightList() {
    this.dlList = document.getElementsByTagName("dl");
    let scrollTop = document.getElementById('scrollContent').scrollTop;
    if (scrollTop === 0) {
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


  }

  scrollToActive() {
    // debugger
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

  componentDidUpdate() {
    this.getHeightList()
  }


  render() {
    return (
      <div className="F10content">
        <div className="contentLeft">
          {
            PAGEMENU.map((item, index) => {
              return (
                <dl key={index}>
                  <dt>{index + 1}</dt>
                  <dd onClick={(e) => this.scrollToAnchor(item.elem, index)}>{item.name}</dd>
                </dl>
              )
            })
          }
        </div>
        <div className="contentRight" id='scrollContent' onScroll={(e) => this.scrollToActive(e)}>
          <div className="rightList" id="zxzb">
            <h2>最新指标</h2>
            <ul className="rule">
              <li>
                <p>
                  市盈率(动态): <span>{this.state.newIdxValData.pe_dym}</span>
                </p>
                <p>
                  市盈率(静态): <span>{this.state.newIdxValData.pe_ttm}</span>
                </p>
                <p>
                  市净率: <span>{this.state.newIdxValData.pb}</span>
                </p>
                <p>
                  每股净资产: <span>{this.state.newIdxValData.bvps}</span>
                </p>
                <p>
                  净资产收益率: <span>{this.state.newIdxValData.roe}%</span>
                </p>
              </li>
              <li>
                <p>
                  总市值: <span>{this.state.newIdxValData.tmkt_val}元</span>
                </p>
                <p>
                  总股本: <span>{this.state.newIdxValData.ttl_shr}股</span>
                </p>
                <p>
                  流通A股: <span>{this.state.newIdxValData.a_shr_circ}股</span>
                </p>
                <p>
                  限售条件A股: <span>{this.state.newIdxValData.a_shr_circ_n}股</span>
                </p>
              </li>
              <li>
                <p>
                  营业收入: <span>{this.state.newIdxValData.oper_inc}元</span>
                </p>
                <p>
                  净利润: <span>{this.state.newIdxValData.net_prof}元</span>
                </p>
                <p>
                  每股收益: <span>{this.state.newIdxValData.eps}元</span>
                </p>
                <p>
                  毛利率: <span>{this.state.newIdxValData.gpm}%</span>
                </p>
              </li>
              <li>
                <p>
                  营收同比增长: <span>{this.state.newIdxValData.oper_inc_yoy}%</span>
                </p>
                <p>
                  净利润同比增长: <span>{this.state.newIdxValData.net_prof_yoy}%</span>
                </p>
              </li>
            </ul>
            <div className="floatright">以上为2018年一季报数据</div>
          </div>
          <div className="rightList" id="sjzl">
            <h2>
              事件总览<span className="floatright">
                温馨提示：下面可左右拖拽，可以滚动缩放
              </span>
            </h2>
            <div className="picshow" style={{ width: '100%', height: '400px' }} id="BubbleChart">
              {/* <div className="picshow"  style={{width:'100%',height:'300px'}}>
            {
              this.state.basSpclNtcDataArr.length > 0 && (
                <BubbleChart type={'hybrid'} baseEvtNameArr={this.baseEvtNameArr} tickValueArr= {this.tickValueArr} basTimeArr={this.basTimeArr} data={this.state.basSpclNtcDataArr} />
               
              )
            }
               */}
            </div>
            <div className="contentBottom">
              <Timeline >
                {
                  this.state.basSpclNtcDataArr.length > 0 && this.state.basSpclNtcDataArr.map((item, index) => {
                    return (
                      <Timeline.Item color="blue" key={index}>
                        <div className='sjzlContent'>
                          {
                            item.showTime && (
                              <div className="evtTime">{item.evt_time1}</div>
                            )
                          }

                          <div className="evtName">{item.evt_typ_name}</div>
                          <div className="bubble bubble_primary bubble_default left">
                            <div className="bubble_cont">
                              <div className="plain">
                                <p className="js_message_plain" id={item.scrollId} onClick={() => this.sjzlClick(item)}>
                                  {item.evt_content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Timeline.Item>
                    )
                  })
                }
              </Timeline>
            </div>
          </div>
          <div className="rightList" id="dzjy">
            <h2>大宗交易</h2>
            <Table
              columns={baseConfig.BlockTransactionTable.columns}
              dataSource={this.state.stkcnBlkTrdDataArr}
              pagination={this.state.dzjypagination}
              loading={this.state.dzjypagination.loading}
              // defaultCurrent = {this.state.pagination}
              locale={{ emptyText: '暂无数据' }}
              onChange={(page, pageSize) => this.dzjyChangePage(page, pageSize)}
              className="tableList"
            />
          </div>
          <div className="rightList" id="zjlx">
            <h2>资金流向</h2>
            <div className="zjlxContent">
              <div className="dzjy">
                <div className="date">
                  <LocaleProvider locale={zh_CN}>
                    <RangePicker
                      allowClear={false}
                      onChange={(date) => this.zjlxDateChose(date)}
                      value={[moment(this.state.zjlxDate.starDate, dateFormat), moment(this.state.zjlxDate.endDate, dateFormat)]}
                      defaultValue={[moment(getMonthYestdy(3, 0, '/'), dateFormat), moment(getMonthYestdy(0, 0, '/'), dateFormat)]}
                      format={dateFormat}
                    />
                  </LocaleProvider>

                </div>
                <div className="chartMain">
                  {
                    zjlxTabs.map((res, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => this.zjlxChangeDate(index)}
                          className={index === this.state.zjlxCurrentIndex ? 'subCtrl active' : 'subCtrl'}
                        >
                          {res.tabName}
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              <div className="rightListMain">
                <div className="tableMain">
                  <div className="picshow" id='barChart' style={{ width: '100%', height: '400px' }}>
                  </div>
                </div>
                <div className="legendMain">
                  <ul>
                    <li>
                      <span className='labelBox priceActive' ></span>
                      <span>个股价格</span>
                    </li>
                    {
                      ZJLXMENU.map((item, index) => {
                        return (
                          <li key={index}>
                            <span
                              className={`labelBox ${index === this.state.zjlxTypeCurrentIndex ? 'typeActive' : ''}`}
                              onClick={() => this.zjlxClick(item, index)}></span>
                            <span>{item.name}</span>
                          </li>
                        )

                      })
                    }

                  </ul>
                </div>
              </div>
              <Table
                pagination={baseConfig.zjlxTable.pagination}
                columns={baseConfig.zjlxTable.columns}
                dataSource={this.state.stkcnMnyFlowDataArr}
                loading={this.state.zjlxpagination.loading}
                scroll={{ y: 400 }}
                locale={{ emptyText: '暂无数据' }}
              />
            </div>
          </div>
          <div className="rightList" id="lhb">
            <h2>龙虎榜</h2>
            <div className="lhb">
              <Tabs type="card">
                {
                  this.state.stkcnAbnTrdDataArr.length > 0 && this.state.stkcnAbnTrdDataArr.map((item, index) => {
                    return (
                      <TabPane tab={item.trd_dt} key={index}>
                        <div className="desc">
                          <span>{item.trd_dt}</span>
                          <span>
                            涨幅：<label>{item.day_chg_rat}%</label>
                          </span>
                          <span>
                            股价：<label>{item.cls_prc}元</label>
                          </span>
                        </div>
                        <div className="details">
                          <div className="left">{item.cst_desc}</div>
                          <div className="right">
                            <span>
                              买入总计：<label className="up">{unitConvert(item.buy_val_sum, 1)}元</label>
                            </span>
                            <span>
                              卖出总计：<label className="down">{unitConvert(item.sell_val_sum, 1)}元</label>
                            </span>
                            <span>
                              买卖净差：<label className="up">{unitConvert(item.buy_sell_sum, 1)}元</label>
                            </span>
                          </div>
                        </div>
                        {
                          item.buy_list.length > 0 && (
                            <div>
                              <Table
                                pagination={baseConfig.lhbTable.pagination}
                                columns={baseConfig.lhbTable.columns}
                                dataSource={item.buy_list}
                                className="tableList"
                                locale={{ emptyText: '暂无数据' }}
                              />
                              <div className="details">
                                <div className="right margin30">
                                  <span>
                                    买入总计：<label className="up">{unitConvert(item.buy_val_sum, 1)}元</label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        {
                          item.sell_list.length > 0 && (
                            <div>
                              <Table
                                pagination={baseConfig.lhbTable2.pagination}
                                columns={baseConfig.lhbTable2.columns}
                                dataSource={item.sell_list}
                                className="tableList"
                                locale={{ emptyText: '暂无数据' }}
                              />
                              <div className="details">
                                <div className="right margin30">
                                  <span>
                                    卖出总计：<label className="down">{unitConvert(item.sell_val_sum, 1)}元</label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </TabPane>
                    )
                  })
                }
              </Tabs>
            </div>
          </div>
          <div className="rightList" id="rzrq">
            <h2>融资融券</h2>
            <div className="zjlxContent">
              <div className="dzjy">
                <div className="date">
                  <LocaleProvider locale={zh_CN}>
                    <RangePicker
                      allowClear={false}
                      onChange={(date) => this.rzrqDateChose(date)}
                      value={[moment(this.state.rzrqDate.starDate, dateFormat), moment(this.state.rzrqDate.endDate, dateFormat)]}
                      defaultValue={[moment(getMonthYestdy(3, 0, '/'), dateFormat), moment(getMonthYestdy(0, 0, '/'), dateFormat)]}
                      format={dateFormat}
                    />
                  </LocaleProvider>

                </div>
                <div className="chartMain">
                  {
                    rzrqTabs.map((res, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => this.rzrqChangeDate(index)}
                          className={index === this.state.rzrqCurrentIndex ? 'subCtrl active' : 'subCtrl'}
                        >
                          {res.tabName}
                        </div>
                      )
                    })
                  }

                </div>
              </div>
              <div className="picshow" style={{ width: '100%', height: '400px' }} id="lineChart">
                {/* <div className="picshow"  style={{width:'100%',height:'300px'}}>
            {
              this.state.basSpclNtcDataArr.length > 0 && (
                <BubbleChart type={'hybrid'} baseEvtNameArr={this.baseEvtNameArr} tickValueArr= {this.tickValueArr} basTimeArr={this.basTimeArr} data={this.state.basSpclNtcDataArr} />
               
              )
            }
               */}
              </div>
              <Table
                pagination={baseConfig.rzrqTable.pagination}
                columns={baseConfig.rzrqTable.columns}
                dataSource={this.state.smtcnExchTrdDetDataArr}
                loading={this.state.rzrqpagination.loading}
                locale={{ emptyText: '暂无数据' }}
                scroll={{ y: 400 }}
              />

            </div>
          </div>
          <div className="rightList" id="xwgg">
            <h2>新闻公告</h2>
            <div className="newsBulletin">
              <div className="list">
                <div>
                  <div className="title">热点新闻</div>
                  <ul>
                    {
                      this.state.ZxTxtNwsLstComsArr && this.state.ZxTxtNwsLstComsArr.map((item, index) => {
                        return (
                          <li key={index} onClick={e => this.props.controller({ isShowNewsDetails: true, newsDetailsData: item })}>
                            <span>{item.pub_time}</span>{item.tit}
                          </li>
                        )
                      })
                    }

                  </ul>
                  <a onClick={e => this.props.controller({ isShowF10NewsListMore: true, F10NewsListMoreData: { defaultActiveKey: '0' } })}>查看更多>></a>
                </div>
                <div>
                  <div className="title">公司公告</div>
                  <ul>
                    {
                      this.state.ZxTxtAnnCentersArr && this.state.ZxTxtAnnCentersArr.map((item, index) => {
                        return (
                          <li key={index} onClick={e => this.props.controller({ isShowNewsDetails: true, newsDetailsData: item })}>
                            <span>{item.pub_time}</span>{item.tit}
                          </li>
                        )
                      })
                    }
                  </ul>
                  <a onClick={e => this.props.controller({ isShowF10NewsListMore: true, F10NewsListMoreData: { defaultActiveKey: '1' } })}>查看更多>></a>
                </div>
              </div>
            </div>
          </div>
          <div className="rightList" id="wgcl">
            <h2>违规处理</h2>
            <div className="wgcl">
              {
                this.state.otbIllBasDataArr.length > 0 && this.state.otbIllBasDataArr.map((item, index) => {
                  return (
                    <ul key={index}>
                      <li>
                        <span>公告日期：</span>
                        <p>
                          {item.pub_dt}{item.info_sour}
                        </p>
                      </li>
                      <li>
                        <span>处罚类型：</span>
                        <p>
                          <label>处罚金额： {item.pun_val}</label>{item.pun_typ}
                        </p>
                      </li>
                      <li>
                        <span>处罚机构：</span>
                        <p>{item.pun_com_name}</p>
                      </li>
                      <li>
                        <span>违规描述：</span>
                        <p>
                          {item.ill_desc}
                        </p>
                      </li>
                      <li>
                        <span>违规说明：</span>
                        <p>
                          {item.evt_desc}
                        </p>
                      </li>

                      <li>
                        <span>处罚详情：</span>
                        <p>
                          <Table
                            pagination={baseConfig.cfxqTable.pagination}
                            columns={baseConfig.cfxqTable.columns}
                            dataSource={item.pun_detail}
                            locale={{ emptyText: '暂无数据' }}
                          />
                        </p>

                        {/* {
                          item.pun_detail.map((item, index) => {
                            return (
                              <p key={index}>{item.pun_obj}{item.pun_rslt}</p>
                            )

                          })

                        } */}

                      </li>
                    </ul>

                  )
                })

              }
            </div>

          </div>
        </div>
        {/* <F10NewsDetails /> */}
      </div>
    );
  }
}
export default F10WrappedComponent(TransactionRule);
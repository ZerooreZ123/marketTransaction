import React, { Component } from "react";
import { Table, Tabs, Carousel, Icon } from 'antd';
import baseConfig from '@/config/F10Config.js';
import './style.less';
import { Resource } from '@/utils/resource'
import { unitConvert } from '@/utils/FormatUtils'
import echarts from 'echarts'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';

const bigInColor = '#d59633', midInColor = '#1c52a3', smaInColor = '#b12421', bigOutColor = '#19a3b4', midOutColor = '#e26f22'
const CQQQColor = '#d59633', LDZCColor = '#1A4B95', GDZCColor = '#B12421', WXZCColor = '#19A3B4', QTZCColor = '#E26F22', LDFZColor = '#766FDF', CQJKColor = '#5D97F2', QTFZColor = '#3E79D1';
const PAGEMENU = [{
  name: '指标一览',
  elem: 'zbyl'
}, {
  name: '资产负债',
  elem: 'zcfz'
}, {
  name: '资本运作',
  elem: 'zbyz'
}, {
  name: '主营构成',
  elem: 'zygc'
}, {
  name: '经营情况描述',
  elem: 'jyqkms'
}]

const filterRatArr = ['net_prof_yoy', 'net_prof_pco_yoy', 'net_prof_pco_excl_yoy', 'oper_inc_yoy', 'roe', 'roe_wt', 'ast_liab_rat', 'sale_npm']
class FinancialCapitalManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuCurrentIndex: 0,
      currentIndex: 0,
      currentIndex2: 0,
      zyCurrentIndex: 0,
      ComcnFinAnalObj: {
        ComcnFinAnalArr: '',
        columns: ''
      },
      ComcnHldLstObj: '',
      ComcnHldFinUnLstObj: '',
      ComcnInvSecuObj: '',
      ComcnMainBizObj: '',
      ComcnFinAnalBizArr: '',
      ComcnMainBizArr: '',

    };
    this.tabs = [
      { tabName: "主要指标", exp: 'ComcnFinAnal' },
      { tabName: "利润", exp: 'ComcnIncStmtNas' },
      { tabName: "现金流", exp: 'ComcnCashFlowNas' },
      { tabName: "资产负债", exp: 'ComcnBalShtNas' },
      { tabName: "证券专项指标", exp: 'ComcnScBkCptl' },
    ];
    this.tabs2 = [
      { tabName: "全部", id: 0 },
      { tabName: "一季报", id: 1 },
      { tabName: "中报", id: 2 },
      { tabName: "三级报", id: 3 },
      { tabName: "年报", id: 4 },
    ];
    this.choseIndex = null;
    this.zyChangeDate = this.zyChangeDate.bind(this)
    this.beforeChange = this.beforeChange.bind(this)
  }
  sendData() {

    let columnsArr = baseConfig.zbylTable[`columns_${this.tabs[this.state.currentIndex].exp}`];
    Resource[this.tabs[this.state.currentIndex].exp].post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/${this.state.currentIndex2}`).then((data) => {
      console.log('指标一览', data)
      if (data.length > 0) {
        let ans = {}, _columns = [];
        columnsArr.forEach(key => data.forEach(item => {
          !ans[key.dataIndex] && (ans[key.dataIndex] = {});
          ans[key.dataIndex]['科目'] = key.title;
          if (filterRatArr.indexOf(key.dataIndex) > -1) {
            ans[key.dataIndex][item.end_dt] = unitConvert(item[key.dataIndex]) + '%';
          } else {
            ans[key.dataIndex][item.end_dt] = unitConvert(item[key.dataIndex]);
          }
        }))
        Object.keys(Object.values(ans)[0]).map(item => _columns.unshift({ title: item, dataIndex: item, width: 120 }))
        // console.log(Object.values(ans), ans, _columns)
        this.setState({ ComcnFinAnalObj: { ComcnFinAnalArr: Object.values(ans), columns: _columns } })
      } else {
        this.setState({ ComcnFinAnalObj: { ComcnFinAnalArr: [], columns: [] } })
      }
    }).catch(err => {

    })



  }

  sendOtherData() {
    Resource.ComcnBalShtGen.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('资产负债', data)
      this.setState({ ComcnBalShtGenArr: data })
      this.BarChartOptional(data)
    }).catch(err => {

    })

    Resource.ComcnHldLst.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('资本运作上市公司', data)
      data[0].datalist.map(item => {
        item.acct_val_end = unitConvert(item.acct_val_end)
        item.hld_val_end = unitConvert(item.hld_val_end)
        item.inv_val_bgn = unitConvert(item.inv_val_bgn)
        item.prof_and_loss = unitConvert(item.prof_and_loss)
      })
      this.setState({ ComcnHldLstObj: data[0] })
      console.log(this.state.ComcnHldLstObj)
    }).catch(err => {

    })

    Resource.ComcnHldFinUnLst.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('资本运作非上市公司', data)
      data[0].datalist.map(item => {
        item.acct_val_end = unitConvert(item.acct_val_end)
        item.hld_val_end = unitConvert(item.hld_val_end)
        item.inv_val_bgn = unitConvert(item.inv_val_bgn)
      })
      this.setState({ ComcnHldFinUnLstObj: data[0] })
      console.log(this.state.ComcnHldFinUnLstObj)
    }).catch(err => {

    })

    Resource.ComcnInvSecu.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('资本运作证券投资', data)
      data[0].datalist.map(item => {
        item.acct_val_end = unitConvert(item.acct_val_end)
        item.hld_val_end = unitConvert(item.hld_val_end)
        item.inv_val_bgn = unitConvert(item.inv_val_bgn)
        item.prof_and_loss = unitConvert(item.prof_and_loss)
      })
      this.setState({ ComcnInvSecuObj: data[0] })
      console.log(this.state.ComcnInvSecuObj)
    }).catch(err => {

    })

    Resource.ComcnMainBiz.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('主营构成', data)
      // debugger
      data[0].biztyplist.map((item, index) => {
        console.log(index)
        // if (index < 2) {
        this.pieChartOptional(item.bizlist, item.biz_typ_name, `PieChart${index}`)
        // }
      })
      this.setState(prevState => {
        prevState.ComcnMainBizObj = data;
      }, () => {
        data.map(item => {
          let newArr = [];
          item.biztyplist.map(_item => {
            _item.bizlist.map(ii => {
              ii.oper_inc1 = ii.oper_inc ? unitConvert(ii.oper_inc) : unitConvert(ii.oper_inc)
              ii.ttl_oper_inc_rat1 = ii.ttl_oper_inc_rat ? unitConvert(ii.ttl_oper_inc_rat) + '%' : unitConvert(ii.ttl_oper_inc_rat);
              ii.oper_cost1 = ii.oper_cost ? unitConvert(ii.oper_cost) : unitConvert(ii.oper_cost)
              ii.ttl_oper_cost_rat1 = ii.ttl_oper_cost_rat ? unitConvert(ii.ttl_oper_cost_rat) + '%' : unitConvert(ii.ttl_oper_cost_rat);
              ii.oper_prof1 = ii.oper_prof ? unitConvert(ii.oper_prof) : unitConvert(ii.oper_prof)
              ii.ttl_oper_prof_rat1 = ii.ttl_oper_prof_rat ? unitConvert(ii.ttl_oper_prof_rat) + '%' : unitConvert(ii.ttl_oper_prof_rat);
              ii.gpm1 = ii.gpm ? unitConvert(ii.gpm) + '%' : unitConvert(ii.gpm);
              newArr.push({
                ...ii,
                biz_typ_code: _item.biz_typ_code,
                biz_typ_name: _item.biz_typ_name
              })
            })
          })
          item.biztyplist1 = newArr;
        })
        // let dataDq = data[0].biztyplist[2].bizlist;
        // this.pieChartOptional(dataHy, data[0].biztyplist[0].biz_typ_name, 'PieChart')
        // this.pieChartOptional(dataCp, data[0].biztyplist[0].biz_typ_name, 'PieChart1')
        this.setState({ ComcnMainBizObj: data, ComcnMainBizArr: data[0].biztyplist1 })
      })


      // console.log(this.state.ComcnInvSecuObj)
    }).catch(err => {

    })

    Resource.ComcnFinAnalBiz.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('经营情况描述', data)
      this.setState({ ComcnFinAnalBizArr: data })
      // console.log(this.state.ComcnInvSecuObj)
    }).catch(err => {

    })
  }
  handleDateCom(index) {
    this.setState(prevState => {
      prevState.currentIndex = index;
    }, () => {
      this.sendData()
    })
  }

  handleDate(index) {
    this.setState(prevState => {
      prevState.currentIndex2 = index;
    }, () => {
      this.sendData()
    })
  }

  zyChangeDate(index) {
    this.setState({ zyCurrentIndex: index, ComcnMainBizArr: this.state.ComcnMainBizObj[index].biztyplist1 })
    this.state.ComcnMainBizObj[index].biztyplist.map((item, index) => {
      console.log(index)
      // if (index < 2) {
      this.pieChartOptional(item.bizlist, item.biz_typ_name, `PieChart${index}`)
      // }

    })

  }

  componentDidMount() {
    this.sendData();
    this.sendOtherData();
  }
  //柱状图
  BarChartOptional(data) {
    let myChart = echarts.init(document.getElementById('BarChart'));
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (datas) {
          var res = datas[0].name + '<br/>'
          for (var i = 0, length = datas.length; i < length; i++) {
            if (!!datas[i].value) {
              res += datas[i].marker + datas[i].seriesName + '：'
                + unitConvert(datas[i].value) + '<br/>'
            }
          }
          return res
        }
      },
      grid: {
        left: '50px',   //距离左边的距离
        right: '50px', //距离右边的距离
        bottom: '50px',//距离下边的距离
        top: '20px', //距离上边的距离
        containLabel: true
      },
      xAxis: {
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
      },
      xAxis: {
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
          },
          formatter: function (value) {
            return unitConvert(value);
          }
        },
      },
      yAxis: {
        type: 'category',
        data: ['资产', '负债'],
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
      },
      series: [
        {
          name: '长期股权投资',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [data.lt_eqy_inv,],
          itemStyle: {
            normal: { color: CQQQColor }
          }
        },
        {
          name: '流动资产合计',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [data.ttl_cur_ast,],
          itemStyle: {
            normal: { color: LDZCColor }
          }
        }, {
          name: '固定资产',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [data.fix_ast],
          itemStyle: {
            normal: { color: GDZCColor }
          }
        }, {
          name: '无形资产',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [data.intg_ast],
          itemStyle: {
            normal: { color: WXZCColor }
          }
        }, {
          name: '其他资产',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [data.oth_ast],
          itemStyle: {
            normal: { color: QTZCColor }
          }
        },
        {
          name: '流动负债合计',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [, data.ttl_cur_liab,],
          itemStyle: {
            normal: { color: LDFZColor }
          }
        },
        {
          name: '长期借款',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [, data.lt_ln],
          itemStyle: {
            normal: { color: CQJKColor }
          }
        },
        {
          name: '其他负债',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: [, data.oth_liab,],
          itemStyle: {
            normal: { color: QTFZColor }
          }
        }
      ]
    });
  }
  pieChartOptional(data, title, chartDom) {
    // debugger/
    let _data = []
    data.map(item => {
      _data.push({ value: item.ttl_oper_inc_rat, name: item.biz_name })
    })
    console.log(_data)
    let myChart = echarts.init(document.getElementById(chartDom));
    myChart.setOption({
      title: {
        text: title,
        x: 'center',
        textStyle: {
          color: '#d8dfeb'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (datas) {
          var res = datas.seriesName + '<br/>' + datas.marker + datas.name + ':' + datas.percent + '%'
          return res
        }
      },
      grid: {
        left: '10px',   //距离左边的距离
        right: '10px', //距离右边的距离
        bottom: '20px',//距离下边的距离
        top: '20px' //距离上边的距离
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        textStyle: {
          color: '#d8dfeb'
        }
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
              textStyle: {
                align: 'left',
                baseline: 'middle',
                fontFamily: '微软雅黑',
                fontSize: 10,
              }
            },
          },
          color: [bigInColor, midInColor, smaInColor, bigOutColor, midOutColor],
          data: _data,
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

  beforeChange() {
    this.state.ComcnMainBizObj && this.state.ComcnMainBizObj[this.state.zyCurrentIndex].biztyplist.map((item, index) => {
      console.log(index)
      this.pieChartOptional(item.bizlist, item.biz_typ_name, `PieChart${index}`)
    })
  }

  clickHandle(flag){
    if(flag ==='prev'){
      this.choseIndex.goTo(0)
      
    }else{
      this.choseIndex.goTo(1)
    }
  }

  componentDidUpdate() {
    this.getHeightList()
  }


  render() {
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj;
    };
    var myArray = new Array(this.state.ComcnMainBizArr.length);
    var func = (data) => {
      //保存上一个name
      var x = "";
      //相同name出现的次数
      var count = 0;
      //该name第一次出现的位置
      var startindex = 0;

      for (var i = 0; i < data.length; i++) {
        var val = data[(i)].biz_typ_name;
        if (i == 0) {
          x = val;
          count = 1;
          myArray[0] = 1
        } else {
          if (val == x) {
            count++;
            myArray[startindex] = count;
            myArray[i] = 0
          } else {
            count = 1;
            x = val;
            startindex = i;
            myArray[i] = 1
          }
        }
      }
    }

    func(this.state.ComcnMainBizArr)
    baseConfig.zygcTable.columns.map(item => {
      if (item.dataIndex === 'biz_typ_name') {
        item.render = (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          obj.props.rowSpan = myArray[index];
          return obj
        }
      } else {
        item.render = renderContent;
      }
    })
    return (
      <div className="F10content">
        <div className="contentLeft">
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
          <div className="rightList" id="zbyl">
            <h2>指标一览</h2>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.tabs.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.handleDateCom(index)}
                        className={index === this.state.currentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res.tabName}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.tabs2.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.handleDate(index)}
                        className={index === this.state.currentIndex2 ? 'subCtrl active' : 'subCtrl'}
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
                <Table pagination={false} dataSource={this.state.ComcnFinAnalObj.ComcnFinAnalArr} columns={this.state.ComcnFinAnalObj.columns} className="tableList" locale={{ emptyText: '暂无数据' }} scroll={{ y: 400 }} />
              </div>
            </div>
          </div>
          <div className="rightList" id="zcfz">
            <h2>资产负债</h2>
            <div className="rightListMain">
              <div className="tableMain">
                <div className="picshow" style={{ width: '100%', height: '200px' }} id="BarChart"></div>
              </div>
              <div className="legendMain" style={{ width: '120px' }}>
                <ul>
                  <li><span className="labelBox" style={{ background: CQQQColor }}></span><span>长期期权投资</span></li>
                  <li><span className="labelBox" style={{ background: LDZCColor }}></span><span>流动资产合计</span></li>
                  <li><span className="labelBox" style={{ background: GDZCColor }}></span><span>固定资产</span></li>
                  <li><span className="labelBox" style={{ background: WXZCColor }}></span><span>无形资产</span></li>
                  <li><span className="labelBox" style={{ background: QTZCColor }}></span><span>其他资产</span></li>
                  <li><span className="labelBox" style={{ background: LDFZColor }}></span><span>流动负债合计</span></li>
                  <li><span className="labelBox" style={{ background: CQJKColor }}></span><span>长期借款</span></li>
                  <li><span className="labelBox" style={{ background: QTFZColor }}></span><span>其他负债</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rightList" id="zbyz">
            <h2>资本运作</h2>
            <p>上市公司投资，截至{this.state.ComcnHldLstObj.end_dt}</p>
            <div className="capitalOperation" style={{ marginBottom: '30px' }}>
              {
                (<Table pagination={baseConfig.gqtzTable.pagination}
                  columns={baseConfig.gqtzTable.columns}
                  dataSource={this.state.ComcnHldLstObj.datalist}
                  locale={{ emptyText: '该股票近期暂无上市公司股权证投资数据' }}
                  className="tableList" />)
              }
            </div>
            <p>非上市公司股权投资，截至{this.state.ComcnHldFinUnLstObj.end_dt}</p>
            <div className="capitalOperation" style={{ marginBottom: '30px' }}>
              {
                (<Table pagination={baseConfig.gqtzfssTable.pagination} columns={baseConfig.gqtzfssTable.columns} dataSource={this.state.ComcnHldFinUnLstObj.datalist} className="tableList" locale={{ emptyText: '该股票近期暂无非上市公司股权证投资数据' }} />)
              }
            </div>
            <p>证券投资，截至{this.state.ComcnInvSecuObj.end_dt}</p>
            <div className="capitalOperation" style={{ marginBottom: '30px' }}>
              {
                (<Table pagination={baseConfig.gqtzTable.pagination} columns={baseConfig.gqtzTable.columns} dataSource={this.state.ComcnInvSecuObj.datalist} className="tableList" locale={{ emptyText: '该股票近期暂无证券投资数据' }} />)
              }
            </div>
          </div>
          <div className="rightList" id="zygc">
            <h2>主营构成</h2>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.state.ComcnMainBizObj && this.state.ComcnMainBizObj.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.zyChangeDate(index)}
                        className={index === this.state.zyCurrentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res.end_dt}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="chartContent">
              <Carousel 
              dots={false}
              ref={el => {this.choseIndex=el}}
              >
                <div>
                  <div className='chartList'>
                    <div className="picshow" id="PieChart0"></div>
                    <div className="picshow" id="PieChart1"></div>
                    {/* <div className="picshow" id="PieChart2"></div> */}
                  </div>
                </div>
                <div>
                  <div className='chartList'>
                    <div className="picshow" id="PieChart2"></div>
                    <div className="picshow" id="PieChart3"></div>
                  </div>
                </div>
                <div style={{ display: 'none' }}>
                  <div className='chartList'>
                    <div className="picshow" id="PieChart4"></div>
                    <div className="picshow" id="PieChart5"></div>
                  </div>
                </div>
              </Carousel>
              <div className='prevHald' onClick={e => this.clickHandle('prev')}><Icon type="left" theme="outlined" /></div>
              <div className='nextHald' onClick={e => this.clickHandle('next')}><Icon type="right" theme="outlined" /></div>

              {/* <div className="picshow" id="PieChart2"></div> */}
            </div>
            <div className="capitalOperation" style={{ marginBottom: '30px' }}>
              {
                // this.state.ComcnMainBizArr && this.state.ComcnMainBizArr.map((item, index) => {
                //   return (
                //     <Table
                //       showHeader={index === 0 ? true : false}
                //       pagination={baseConfig.zygcTable.pagination}
                //       columns={baseConfig.zygcTable.columns}
                //       dataSource={item}
                //       className="tableList"
                //       locale={{ emptyText: '该股票近期暂无证券投资数据' }}
                //     />
                //   )
                // })
                (<Table pagination={baseConfig.zygcTable.pagination} columns={baseConfig.zygcTable.columns} dataSource={this.state.ComcnMainBizArr} className="tableList" locale={{ emptyText: '该股票近期暂无证券投资数据' }} />)
              }
            </div>
          </div>
          <div className="rightList" id="jyqkms">
            <h2>经营情况描述</h2>
            <Tabs type="card">
              {
                this.state.ComcnFinAnalBizArr && (
                  this.state.ComcnFinAnalBizArr.map((item, index) => {
                    return (
                      <Tabs.TabPane tab={item.end_dt} key={index}>
                        <div className='listText'>
                          <p>{item.biz_comment}</p>
                        </div>
                      </Tabs.TabPane>
                    )
                  })
                )
              }
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default F10WrappedComponent(FinancialCapitalManagement);
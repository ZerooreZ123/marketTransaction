import React, { Component } from "react";
import { Table } from 'antd';
import baseConfig from '@/config/F10Config.js';
import './style.less';
import { Resource } from '@/utils/resource'
import _maxBy from 'lodash/maxBy';
import { unitConvert } from '@/utils/FormatUtils'
import moment from "moment";
import echarts from 'echarts'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';


const BBColor = '#c2892f', ZCColor = '#a1211e', JCColor = '#274346', XJColor = '#1a4b95';
const SXAColor = '#BC842C', FSXAColor = '#1C4888', BGColor = '#189680', HGColor = '#9B231F', QTColor = '#CCCCCC';

const JGCGCOLORARR = [
  {
    color: '#766fdf',
    code: -1,
    name: '其他'
  }, {
    color: '#168795',
    name: '基金',
    code: '1001'
  }, {
    color: '#9B231F',
    name: '券商',
    code: '1101'
  }, {
    color: '#BC842C',
    name: 'QFII',
    code: '1201'
  }, {
    color: '#c2892f',
    name: '保险',
    code: '1301'
  }, {
    color: '#a1211e',
    name: '信托',
    code: '1401'
  }, {
    color: '#1a4b95',
    name: '财务公司',
    code: '1501'
  }, {
    color: '#1C4888',
    name: '银行',
    code: '1601'
  },

]
const PAGEMENU = [{
  name: '十大流通股东',
  elem: 'sdltgd'
}, {
  name: '十大股东',
  elem: 'sdgd'
}, {
  name: '控股层级研究',
  elem: 'kgcjyj'
}, {
  name: '股东人数',
  elem: 'gdrs'
}, {
  name: '高管持股变动',
  elem: 'ggcgbd'
}, {
  name: '机构持股',
  elem: 'jgcg'
}, {
  name: '股东限售解禁',
  elem: 'gdxsjj'
}, {
  name: '总股本结构',
  elem: 'zgbjg'
}, {
  name: 'A股变动记录',
  elem: 'agbdjl'
}]


class ShareHolders extends Component {

  constructor() {
    super();
    this.state = {
      currentIndex: 1,
      menuCurrentIndex: 0,
      enddtlist: '',
      shlistlist: '',
      sdCurrentIndex: 0,
      ComcnShNumList: '',
      ComcnShOrgColList: '',
      ComcnLdrShrChgList: '',
      ComcnShLimCircList: '',
      enddtlist1: '',
      shlistlist1: '',
      sdCurrentIndex1: 0,
    };
    this.ComcnShData = '';
    this.ComcnShData1 = '';
    this.tabs = [
      { tabName: "控股第一层", id: 1 },
      { tabName: "控股第二层", id: 2 },
      { tabName: "控股第三层", id: 3 },
      { tabName: "控股第四层", id: 4 },
      { tabName: "控股第五层", id: 5 },
      { tabName: "控股第六层", id: 6 },
      { tabName: "控股第七层", id: 7 },
    ];
    this.tabs2 = [
      { tabName: "100%占比", id: 1 },
      { tabName: "实际占比", id: 2 },
    ]
  }
  tabChoiced = (id) => {
    // tab切换的方法
    console.log(id)
    this.setState({
      currentIndex: id
    });
  }
  ComcnShService() {
    Resource.ComcnSh.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/10`).then((data) => {
      console.log('十大流通股东', data)
      data.shlist.map(item => {
        item.map(_item => {
          _item.ttl_cptl_rat1 = _item.ttl_cptl_rat.toFixed(2) + '%'
        })
      })
      this.ComcnShData = data;
      let _enddtlist = data.enddtlist.map(item => (item).substr(0, 4) + "年" + (item).substr(4, 2) + '月' + (item).substr(6, 2) + '日')
      this.setState({ enddtlist: _enddtlist, shlistlist: data.shlist[0] })
    }).catch(err => {

    })

    Resource.ComcnSh.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/20`).then((data) => {
      console.log('十大股东', data)
      data.shlist.map(item => {
        item.map(_item => {
          _item.ttl_cptl_rat1 = _item.ttl_cptl_rat.toFixed(2) + '%'
        })
      })
      this.ComcnShData1 = data;
      let _enddtlist = data.enddtlist.map(item => (item).substr(0, 4) + "年" + (item).substr(4, 2) + '月' + (item).substr(6, 2) + '日')
      this.setState({ enddtlist1: _enddtlist, shlistlist1: data.shlist[0] })
    }).catch(err => {

    })

    Resource.ComcnRelSh.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('控股层级研究', data)
    }).catch(err => {

    })

    Resource.ComcnShNum.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('股东人数', data)
      // data.map(item => {
      //   debugger
      //   item.a_avg_shr = item.a_avg_shr? item.a_avg_shr.toFixed(2): '--';
      //   item.cls_prc = item.cls_prc? item.cls_prc.toFixed(2): '--';
      //   item.a_ttl_sh = item.a_ttl_sh? item.a_ttl_sh: '--';
      // })
      data.map(item => [['a_avg_shr', 2], ['cls_prc', 2], ['a_ttl_sh', 0]].forEach(([key, dig]) => item[key] = item[key] ? item[key].toFixed(dig) : '--'))
      this.setState({ ComcnShNumList: data })
    }).catch(err => {

    })

    Resource.ComcnLdrShrChg.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('高管持股变动', data)
      data.map(item => {
        item.chg_rat = item.chg_rat + '%'
        item.chg_shr_aft = unitConvert(item.chg_shr_aft, 1, 2)
        item.chg_shr = unitConvert(item.chg_shr, 1, 2)
        item.chg_shr = parseFloat(item.chg_shr) > 0 ? `增持 ${item.chg_shr}` : `减持 ${item.chg_shr}`
      })
      this.setState({ ComcnLdrShrChgList: data })
    }).catch(err => {

    })
    Resource.ComcnShOrgCol.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('机构持股', data)
      data.map((item, index) => {
        item.hld_shr = parseFloat(((item.hld_shr) / 10000).toFixed(2))
        item.hld_val = parseFloat(((item.hld_val) / 100000000).toFixed(2))
        item.ttl_cptl_rat = parseFloat((item.ttl_cptl_rat).toFixed(2))
      })
      this.setState({ ComcnShOrgColList: data })
      this.pieChartOptional(data[0].rateList, data[0].end_dt)
    }).catch(err => {

    })

    Resource.ComcnShLimCirc.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('股东限售解禁', data)
      data.map((item, index) => {
        item.hld_shr = unitConvert(item.hld_shr)
        item.new_shr = unitConvert(item.new_shr)
        item.bgn_dt = moment(item.bgn_dt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')
      })
      console.log(data)
      this.setState({ ComcnShLimCircList: data })
    }).catch(err => {

    })

    Resource.ComcnShrChg.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('总股本结构', data)
      let end_dtArr = [], chg_rsn_descArr = [], a_shr_circArr = [], a_shr_circ_nArr = [], b_shrArr = [], h_shrArr = [], else_shrArr = [];
      data.map(item => {
        end_dtArr.push(item.end_dt)
        chg_rsn_descArr.push(item.chg_rsn_desc ? item.chg_rsn_desc : '--')
        a_shr_circArr.push(item.a_shr_circ)
        a_shr_circ_nArr.push(item.a_shr_circ_n)
        b_shrArr.push(item.b_shr)
        h_shrArr.push(item.h_shr)
        else_shrArr.push(item.else_shr)
      })
      this.BarChartOptional(end_dtArr, a_shr_circArr, a_shr_circ_nArr, b_shrArr, h_shrArr, else_shrArr)
      this.BarChartOptional2(end_dtArr, chg_rsn_descArr, a_shr_circArr, a_shr_circ_nArr)
    }).catch(err => {

    })

  }

  sdChangeDate(type, index) {
    console.log(this.ComcnShData)
    if (type === 10) {
      this.setState(prevState => {
        prevState.sdCurrentIndex = index;
        prevState.shlistlist = this.ComcnShData.shlist[index];
        return prevState;
      })
    } else {
      this.setState(prevState => {
        prevState.sdCurrentIndex1 = index;
        prevState.shlistlist1 = this.ComcnShData1.shlist[index];
        return prevState;
      })
    }
  }

  pieChartOptional(data, title) {
    let _data = []
    if(!data){
      return
    }
    data.map(item => {
      _data.push({ value: item.shr_rat, name: item.com_typ_desc ,code :item.com_typ_code})
    })
    // console.log(_data)
    let myChart = echarts.init(document.getElementById('PieChart'));
    myChart.setOption({
      title: {
        text: title,
        x: 'center',
        textStyle: {
          color: '#d8dfeb'
        }
      },
      grid: {
        left: '10px',   //距离左边的距离
        right: '10px', //距离右边的距离
        bottom: '20px',//距离下边的距离
        top: '0px' //距离上边的距离
      },

      series: [
        {
          name: title,
          type: 'pie',
          radius: '60%',
          center: ['50%', '60%'],
          data: _data,
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: function (datas) {
                var res = datas.name + ':' + datas.percent + '%'
                return res
              },
              textStyle: {
                align: 'left',
                baseline: 'middle',
                fontFamily: '微软雅黑',
                fontSize: 14,
              }
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal: {
              color: function (datas) {
                return JGCGCOLORARR.find((res) => datas.data.code === res.code).color
              },

            },
          }
        }
      ]
    });
  }

  //柱状图
  BarChartOptional(end_dtArr, a_shr_circArr, a_shr_circ_nArr, b_shrArr, h_shrArr, else_shrArr) {
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
              res += datas[i].marker + datas[i].seriesName + ':'
                + unitConvert(datas[i].value) + '股' + '<br/>'
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
            return unitConvert(value) + '股';
          }
        },
      },
      yAxis: {
        type: 'category',
        data: end_dtArr,
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
          name: '受限A股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: a_shr_circ_nArr,
          itemStyle: {
            normal: { color: SXAColor }
          }
        },
        {
          name: '非受限A股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: a_shr_circArr,
          itemStyle: {
            normal: { color: FSXAColor }
          }
        },
        {
          name: 'B股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: b_shrArr,
          itemStyle: {
            normal: { color: BGColor }
          }
        },
        {
          name: 'H股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: h_shrArr,
          itemStyle: {
            normal: { color: HGColor }
          }
        },
        {
          name: '其他',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: else_shrArr,
          itemStyle: {
            normal: { color: QTColor }
          }
        }
      ]
    });
  }
  BarChartOptional2(end_dtArr, chg_rsn_descArr, a_shr_circArr, a_shr_circ_nArr) {
    let myChart = echarts.init(document.getElementById('BarChart2'));
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (datas) {
          var res = datas[0].name + '<br/>'
          for (var i = 0, length = datas.length; i < length; i++) {
            let _value = datas[i].value;
            _value = _value ? unitConvert(datas[i].value) : '0.00亿元'
            res += datas[i].marker + datas[i].seriesName + '：'
              + _value + '元' + '<br/>'
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
        data: end_dtArr,
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
          formatter: function (value, index) {
            return value + "\n" + chg_rsn_descArr[index];
          }
        }
      },
      series: [
        {
          name: '流通A股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: a_shr_circArr,
          itemStyle: {
            normal: { color: SXAColor }
          }
        },
        {
          name: '限售A股',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          },
          barWidth: 20,
          data: a_shr_circ_nArr,
          itemStyle: {
            normal: { color: FSXAColor }
          }
        }
      ]
    });
  }
  componentDidMount() {
    this.ComcnShService();
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

  componentDidUpdate() {
    this.getHeightList()
  }

  render() {
    let _maxByData = _maxBy(this.state.shlistlist, 'ttl_cptl_rat');
    this.state.shlistlist && baseConfig.sdltgdTable.columns.map((item, index) => {
      if (item.dataIndex === 'chart') {
        item.render = (ttl_cptl_rat, record) => {
          return (
            <div className="percentage" >
              <div></div>
              <div>
                <div style={{
                  width: `${parseInt(Math.abs((record.ttl_cptl_rat) / _maxByData.ttl_cptl_rat) * 100)}%`,
                  background: BBColor,
                  height: '100%'
                }} >
                  <div style={{
                    width: `${parseInt(Math.abs((record.hld_shr_chg_lst) / record.hld_shr) * 100)}%`,
                    background: record.hld_shr_chg_lst === record.hld_shr ? XJColor : record.hld_shr_chg_lst > 0 ? ZCColor : JCColor,
                    height: '100%',
                    float: 'right'
                  }} >

                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
    })
    // debugger
    this.state.ComcnShOrgColList && baseConfig.cgjgTable.columns.map((item, index, array) => {
      if (item.dataIndex === 'rateList') {
        item.render = (text, record) => {
          let _maxByData = _maxBy(this.state.ComcnShOrgColList, item.dataIndex);
          return (
            <div className="percentage" onMouseOver={() => this.pieChartOptional(record.rateList, record.end_dt)}>
              <div>
                {
                  text && text.map((_item, index) => {
                    return (
                      <div key={index} style={{
                        width: `${parseInt(_item.shr_rat)}%`,
                        background: JGCGCOLORARR.find((res) => _item.com_typ_code === res.code).color,
                        // background: _item.com_typ_desc === '其他' ? JGQTColor : _item.com_typ_desc === '基金' ? JQJJColor : JQ22Color,
                        height: '20px'
                      }} >
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      } else {
        if (['end_dt'].indexOf(item.dataIndex) === -1) {
          item.render = (text, record) => {
            let _maxByData = _maxBy(this.state.ComcnShOrgColList, item.dataIndex);
            return (
              <div className="percentage" onMouseOver={() => this.pieChartOptional(record.rateList, record.end_dt)}>
                <div>{text}</div>
                <div>
                  <div style={{
                    width: `${parseInt(Math.abs(text / _maxByData[item.dataIndex]) * 100)}%`,
                    background: BBColor,
                    height: '100%'
                  }} >
                  </div>
                </div>
              </div>
            )
          }
        }
      }

    })
    this.state.ComcnShLimCircList && baseConfig.ggcgbdTable.columns.map((item, index, array) => {
      if (item.dataIndex === 'chg_shr') {
        item.render = (text, record) => {
          return (
            <span className={text.indexOf('增持') > -1 ? 'red' : 'green'}>{text}
            </span>
          )
        }
      }
    })


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
        <div className="contentRight" id="scrollContent" onScroll={(e) => this.scrollToActive(e)}>
          <div className="rightList" id='sdltgd'>
            <h2>十大流通股东</h2>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.state.enddtlist && this.state.enddtlist.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.sdChangeDate(10, index)}
                        className={index === this.state.sdCurrentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="rightListMain">
              <div className="tableMain">
                {
                  this.state.shlistlist && <Table pagination={false} dataSource={this.state.shlistlist} columns={baseConfig.sdltgdTable.columns} className="tableList" locale={{ emptyText: '暂无数据' }} />
                }
              </div>
              <div className="legendMain">
                <ul>
                  <li><span className="labelBox" style={{ background: BBColor }}></span><span>不变部分</span></li>
                  <li><span className="labelBox" style={{ background: ZCColor }}></span><span>增持部分</span></li>
                  <li><span className="labelBox" style={{ background: JCColor }}></span><span>坚持部分</span></li>
                  <li><span className="labelBox" style={{ background: XJColor }}></span><span>新晋股东</span></li>
                </ul>
              </div>
            </div>

          </div>
          <div className="rightList" id="sdgd">
            <h2>十大股东</h2>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.state.enddtlist && this.state.enddtlist.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.sdChangeDate(20, index)}
                        className={index === this.state.sdCurrentIndex1 ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="rightListMain">
              <div className="tableMain">
                {
                  this.state.shlistlist && <Table pagination={false} dataSource={this.state.shlistlist1} columns={baseConfig.sdltgdTable.columns} className="tableList" locale={{ emptyText: '暂无数据' }} />
                }
              </div>
              <div className="legendMain">
                <ul>
                  <li><span className="labelBox" style={{ background: BBColor }}></span><span>不变部分</span></li>
                  <li><span className="labelBox" style={{ background: ZCColor }}></span><span>增持部分</span></li>
                  <li><span className="labelBox" style={{ background: JCColor }}></span><span>坚持部分</span></li>
                  <li><span className="labelBox" style={{ background: XJColor }}></span><span>新晋股东</span></li>
                </ul>
              </div>
            </div>


          </div>
          <div className="rightList" id="kgcjyj">
            <h2>控股层级研究</h2>
            <div className="kgcjyj">
              <h3>
                提醒
                    </h3>
              <span>下图为{this.props.f10Data.stockName}({this.props.f10Data.stockCode})控股层级研究。</span>
              <ul>
                <li>不同颜色的色块代表不同的公司</li>
                <li>色块的宽度代表该公司直接或间接控股{this.props.f10Data.stockName}({this.props.f10Data.stockCode})的比例</li>
                <li>鼠标悬浮色块上面可以看到详细信息</li>
              </ul>
            </div>
            <div className="tabMenu tabMenu2">
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
            </div>
            <div className="tabMenu tabMenu2">
              <div className="chartMain">
                {
                  this.tabs2.map((res, index) => {
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
            </div>
            <div className="rightListMain">
              <div className="tableMain">
                {/* <Table pagination={false} dataSource={dataList} columns={columns} className="tableList" /> */}
              </div>
              <div className="legendMain" style={{ width: 220 }}>
                <ul>
                  <li><span className="labelBox"></span><span>招商证券股份有限公司</span></li>
                  <li><span className="labelBox"></span><span>深圳市招商融投资控股有限公司</span></li>
                  <li><span className="labelBox"></span><span>深圳市极盛投资发展有限公司</span></li>
                  <li><span className="labelBox"></span><span>招商局轮船有限公司</span></li>
                  <li><span className="labelBox"></span><span>招商证券股份有限公司</span></li>
                  <li><span className="labelBox"></span><span>深圳市招商融投资控股有限公司</span></li>
                  <li><span className="labelBox"></span><span>深圳市极盛投资发展有限公司</span></li>
                  <li><span className="labelBox"></span><span>招商局轮船有限公司</span></li>
                </ul>
              </div>
            </div>

          </div>
          <div className="rightList" id="gdrs">
            <h2>股东人数</h2>
            <div className="picshow">
              {
                this.state.ComcnShNumList && <Table
                  pagination={baseConfig.gdrsTable.pagination}
                  columns={baseConfig.gdrsTable.columns}
                  dataSource={this.state.ComcnShNumList}
                  scroll={{ y: 400 }}
                  locale={{ emptyText: '暂无数据' }}
                  className="tableList" />
              }

            </div>
          </div>
          <div className="rightList" id="ggcgbd">
            <h2>高管持股变动</h2>
            <div className="picshow">
              <Table pagination={baseConfig.ggcgbdTable.pagination} columns={baseConfig.ggcgbdTable.columns} dataSource={this.state.ComcnLdrShrChgList} locale={{ emptyText: '暂无数据' }} className="tableList" scroll={{ y: 400 }} />
            </div>
          </div>
          <div className="rightList" id="jgcg">
            <h2>机构持股</h2>
            <div className="kgcjyj">
              <h3>
                提醒
                    </h3>
              <span>机构持股数据为已经发布报告的基金持股和公司十大流通股东汇总。统计的机构类型包括:基金、QFII、 券商、保险、社保、信托、财务公司、年金。最近一期数据可能因为基金投资组合或公司定期报告未被披露完毕，导致汇总数据不够完整。</span>
            </div>
            <div className="rightListMain">
              <div className="tableMain">
                {
                  this.state.shlistlist && <Table pagination={false} dataSource={this.state.ComcnShOrgColList} columns={baseConfig.cgjgTable.columns} className="tableList" scroll={{ y: 400 }} locale={{ emptyText: '暂无数据' }} />
                }
              </div>
              <div className="legendMain">
                <div className="picshow" style={{ width: '300px', height: '300px' }} id="PieChart"></div>
              </div>
            </div>
          </div>
          <div className="rightList" id="gdxsjj">
            <h2>股东限售解禁表</h2>
            <div className="picshow">
              {
                this.state.ComcnShLimCircList && <Table pagination={false} columns={baseConfig.gdjsjjbTable.columns} dataSource={this.state.ComcnShLimCircList} className="tableList" scroll={{ y: 400 }} locale={{ emptyText: '暂无数据' }} />
              }

            </div>
          </div>
          <div className="rightList" id="zgbjg">
            <h2>总股本结构</h2>

            <div className="rightListMain">
              <div className="tableMain">
                <div className="picshow" style={{ width: '100%', height: '400px' }} id="BarChart"></div>
              </div>
              <div className="legendMain" style={{ width: '100px' }}>
                <ul>
                  <li><span className="labelBox" style={{ background: SXAColor }}></span><span>受限A股</span></li>
                  <li><span className="labelBox" style={{ background: FSXAColor }}></span><span>非受限A股</span></li>
                  <li><span className="labelBox" style={{ background: BGColor }}></span><span>B股</span></li>
                  <li><span className="labelBox" style={{ background: HGColor }}></span><span>H股</span></li>
                  <li><span className="labelBox" style={{ background: QTColor }}></span><span>其他</span></li>
                </ul>
              </div>
            </div>

          </div>
          <div className="rightList" id="agbdjl">
            <h2>A股变动记录</h2>
            <div className="rightListMain">
              <div className="tableMain">
                <div className="picshow" style={{ width: '100%', height: '400px' }} id="BarChart2"></div>
              </div>
              <div className="legendMain" style={{ width: '100px' }}>
                <ul>
                  <li><span className="labelBox" style={{ background: SXAColor }}></span><span>流通A股</span></li>
                  <li><span className="labelBox" style={{ background: FSXAColor }}></span><span>限售A股</span></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default F10WrappedComponent(ShareHolders);
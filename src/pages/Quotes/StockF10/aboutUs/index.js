import React, { Component } from 'react';
import { Tabs } from 'antd';
import './style.less';
import { Resource } from '@/utils/resource';
import { unitConvert } from '@/utils/FormatUtils'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';
import echarts from 'echarts'

const PAGEMENU = [{
  name: '公司概括',
  elem: 'gsgk'
}, {
  name: '高管介绍',
  elem: 'ggjs'
}, {
  name: '高管兼职',
  elem: 'ggjz'
}, {
  name: '发行历史',
  elem: 'fxls'
}]

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ComcnCardData: '',
      comcn_ldr_pt_info: '',
      menuCurrentIndex: 0,
    }
    this.tabs = [
      { tabName: "表格", id: 0 },
      { tabName: "图形", id: 1 },
      { tabName: "关联度", id: 2 },
    ];
  }

  ComcnCardService() {
    Resource.ComcnCard.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('公司信息', data)
      let newArr = [];
      let newObj = {};
      data.comcn_ldr_pt_info.forEach((item, index) => {
        !newObj[item.PSN_ID] && (newObj[item.PSN_ID] = { PSN_ID: item.PSN_ID, PSN_NAME: item.PSN_NAME, comMapPosi: [] });
        //['PT_COM_NAME', 'PT_POSI_NAME'].forEach(key => newObj[item.PSN_ID].comMapPosi[key] = item[key]);
        newObj[item.PSN_ID].comMapPosi.push({ PT_POSI_NAME: item.PT_POSI_NAME, PT_COM_NAME: item.PT_COM_NAME });
      })
      newObj = Object.values(newObj);
      data.comcn_iss_his.map((item, index) => {
        item.FOUND_DT = item.FOUND_DT.substring(0, 4) + "年" + item.FOUND_DT.substring(4, 6) + "月" + item.FOUND_DT.substring(6, 8) + '日'
        item.LST_DT = item.LST_DT.substring(0, 4) + "年" + item.LST_DT.substring(4, 6) + "月" + item.LST_DT.substring(6, 8) + '日'
      })

      this.setState({ ComcnCardData: data, comcn_ldr_pt_info: newObj })
      // this.treeChartOptional(data.comcn_ldr_pt_info)
      // this.graphChartOptional(data.comcn_ldr_pt_info)

    }).catch(err => {

    })
  }
  componentDidMount() {
    this.ComcnCardService();
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




  graphChartOptional(data) {
    let mainDom = {
      clientWidth: document.documentElement.clientWidth * 0.88 * 0.68,
      clientHeight: parseFloat(document.getElementById('treeChart').style.height)
    };
    let nodes = []
    let links = []

    let newPsnData = {}, newPsnArr = [], newPtData = {}, newPtArr = [];
    data.map((item, index) => {
      if (newPsnData[item.PSN_ID] === undefined) {
        newPsnData[item.PSN_ID] = []
        newPsnArr.push({ name: item.PSN_NAME, depth: 1, id: String(item.PSN_ID) });
      }

      if (newPtData[item.PT_COM_NAME] === undefined) {
        newPtData[item.PT_COM_NAME] = []
        newPtArr.push({ name: item.PT_COM_NAME, depth: 2, id: 'pt_' + newPtArr.length });
      }
    })
    let psnHeight = mainDom.clientHeight / newPsnArr.length;
    let ptHeight = mainDom.clientHeight / newPtArr.length;
    let width = mainDom.clientWidth / 3;

    newPsnArr.map((item, index) => {
      item.x = width
      item.category = item.name
      item.y = psnHeight * index
    })
    newPtArr.map((item, index) => {
      item.x = width * 2
      item.category = item.name
      item.y = ptHeight * index
    })

    nodes = [{ name: this.props.f10Data.stockCode, depth: 0, x: 0, y: mainDom.clientHeight / 2, id: '-1' }, ...newPsnArr, ...newPtArr]
    data.map(item => {
      links.push({ source: String(item.PSN_ID), target: newPtArr.find(_item => _item.name === item.PT_COM_NAME).id, weight: 1 })
    })
    newPsnArr.map(item => {
      links.push({ source: '-1', target: item.id, weight: 1 })
    })
    let myChart = echarts.init(document.getElementById('treeChart'));
    myChart.clear();
    myChart.setOption({
      tooltip: {},
      series: [{
        type: 'graph',
        layout: 'none',
        zlevel: 0,
        symbolSize: 12,
        roam: false,
        silent: false,               //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
        legendHoverLink: false,       //是否启用图例 hover 时的联动高亮。
        hoverAnimation: false,        //是否开启鼠标 hover 节点的提示动画效果。
        focusNodeAdjacency: true,   //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
        left: "10%",                 //组件离容器左侧的距离,百分比字符串或整型数字
        top: 60,                      //组件离容器上侧的距离，百分比字符串或整型数字
        right: "auto",               //组件离容器右侧的距离,百分比字符串或整型数字
        bottom: "auto",              //组件离容器下侧的距离,百分比字符串或整型数字
        label: {
          normal: {
            show: true,
            position: "right",
            textStyle: {
              color: "#d8dfeb",               //文字颜色
              fontStyle: "normal",         //italic斜体  oblique倾斜
              fontWeight: "normal",        //文字粗细bold   bolder   lighter  100 | 200 | 300 | 400...
              fontFamily: "sans-serif",    //字体系列
              fontSize: 14,                  //字体大小
              zlevel: 2,
            }
          }
        },
        edgeSymbol: ['circle'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 60
            }
          }
        },
        data: nodes,
        links: links,
        categories: nodes,
        lineStyle: {
          normal: {
            color: '#26436a',
            opacity: 0.9,
            width: 1,
            curveness: 0
          }
        }
      }]
    })

  }


  graphChartOptional2(data) {
    let mainDom = {
      clientWidth: document.documentElement.clientWidth * 0.88 * 0.68,
      clientHeight: parseFloat(document.getElementById('treeChart').style.height)
    };
    let nodes = []
    let links = []

    let newPsnData = {}, newPsnArr = [], newPtData = {}, newPtArr = [];
    data.map((item, index) => {
      if (newPsnData[item.PSN_ID] === undefined) {
        newPsnData[item.PSN_ID] = []
        newPsnArr.push({ name: item.PSN_NAME, id: String(item.PSN_ID) });
      }

      if (newPtData[item.PT_COM_NAME] === undefined) {
        newPtData[item.PT_COM_NAME] = []
        newPtArr.push({ name: item.PT_COM_NAME, id: 'pt_' + newPtArr.length });
      }
    })
    let psnHeight = mainDom.clientHeight / newPsnArr.length;
    let ptHeight = mainDom.clientHeight / newPtArr.length;
    let width = mainDom.clientWidth / 3;

    var size = 60;
    var size1 = 30;
    var yy = 0;
    var yy1 = 250;

    newPsnArr.map((item, index) => {
      item.x = width
      item.y = yy1
      item.flag = '0'
      item.symbolSize = size
      item.category = item.name
      item.draggable = "true"

    })
    newPtArr.map((item, index) => {
      item.x = width * 2
      item.y = yy
      item.flag = '1'
      item.symbolSize = size1
      item.category = item.name
      item.draggable = "true"
    })

    nodes = [{ name: this.props.f10Data.stockCode, x: 0, y: yy, id: '-1', "symbolSize": 80, "draggable": "true", 'flag': '0' }, ...newPsnArr, ...newPtArr]
    data.map(item => {
      links.push({ source: String(item.PSN_ID), target: newPtArr.find(_item => _item.name === item.PT_COM_NAME).id, weight: 1 })
    })
    newPsnArr.map(item => {
      links.push({ source: '-1', target: item.id, weight: 1 })
    })
    let myChart = echarts.init(document.getElementById('treeChart'));
    myChart.clear();
    myChart.setOption({
      animationDuration: 1000,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        name: '知识体系',
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 260,
          gravity: 0.1,
          edgeLength: 80,
          layoutAnimation: true,
        },
        data: nodes,
        links: links,
        categories: nodes,
        roam: false,
        label: {
          normal: {
            show: true,
            position: 'inside',
            formatter: function (data) {
              if (data.data.flag === '0') {
                return data.name
              }
              // debugger
            },
            fontSize: 14,
            fontStyle: '600',
          }
        },
        lineStyle: {
          normal: {
            color: '#26436a',
            opacity: 0.9,
            width: 1,
            curveness: 0
          }
        }
      }]
    })

  }

  handleDateCom(index) {
    this.setState(prevState => {
      prevState.menuCurrentIndex = index;
      return prevState;
    }, () => {
      if (index === 1) {
        this.graphChartOptional(this.state.ComcnCardData.comcn_ldr_pt_info)
      } else if (index === 2) {
        this.graphChartOptional2(this.state.ComcnCardData.comcn_ldr_pt_info)
      }

    })
  }

  render() {
    return (
      <div className="F10content">
        <div className="contentLeft">
          {
            PAGEMENU.map((item, index) => {
              return (
                <dl key={index} >
                  <dt>{index + 1}</dt>
                  <dd onClick={(e) => this.scrollToAnchor(item.elem, index)}>{item.name}</dd>
                </dl>
              )
            })
          }
        </div>
        <div className="contentRightGsjs" id="scrollContent" onScroll={(e) => this.scrollToActive(e)}>
          <div className="rightList" id='gsgk'>
            <h2>公司概括</h2>
            <p className="gsgk">
              {this.state.ComcnCardData.COM_HIS}
            </p>
          </div>
          <div className="rightList" id='ggjs'>
            <h2>高管介绍</h2>
            <div className="picshow">
              {
                this.state.ComcnCardData && this.state.ComcnCardData.comcn_ldr_info.map((item, index) => {
                  return (
                    <div className="ggjs" key={index}>
                      <div className="jobLevel">
                        <span>
                          {item.POSI_TYP_NAME}({item.ttl_count}人)
                        </span>
                      </div>
                      <div className="jobName">
                        <ul>
                          {
                            item.memberlist.map((ii, _index) => {
                              return (
                                <li key={_index}>
                                  <span>{ii.psn_name}</span><span>{ii.posi_name}</span>
                                </li>
                              )

                            })
                          }
                        </ul>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="rightList" id='ggjz'>
           
            <h2>高管兼职</h2>
            <div className="tabMenu">
              <div className="chartMain">
                {
                  this.tabs.map((res, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.handleDateCom(index)}
                        className={index === this.state.menuCurrentIndex ? 'subCtrl active' : 'subCtrl'}
                      >
                        {res.tabName}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            {
              this.state.menuCurrentIndex === 0 && (
                <div className="dzjy">
                  <div className="contentTable contentTableTh">
                    <div className="ygName">
                      <ul >
                        <li>
                          <span>领导姓名</span>
                        </li>
                      </ul>
                    </div>
                    <div className="gsName">
                      <ul >
                        <li>
                          <span className='ptcom'>简直企业名称</span> <span className='ptpost'>兼职职务</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {
                    this.state.comcn_ldr_pt_info && this.state.comcn_ldr_pt_info.map((item, index) => {
                      return (
                        <div className="contentTable" key={index}>
                          <div className="ygName">
                            <ul >
                              <li>
                                <span>{item.PSN_NAME}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="gsName">
                            <ul >
                              {
                                item.comMapPosi.map((_item, _index) => {
                                  return (
                                    <li key={_index}>
                                      <span className='ptcom'>{_item.PT_COM_NAME}</span> <span className='ptpost'>{_item.PT_POSI_NAME}</span>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ) 
            }
            {
              this.state.menuCurrentIndex !== 0 && (
                <div id='treeChart' style={{ width: '100%', height: '600px' }}></div>
              )
            }

          </div>
          <div className="rightList" id='fxls'>
            <h2>发行历史</h2>
            {
              this.state.ComcnCardData && this.state.ComcnCardData.comcn_iss_his.map((item, index) => {
                return (
                  <div className="fxls" key={index}>
                    <div className="fxlsTop">
                      <div>
                        <div className="title">
                          成立日期
                                    </div>
                        <div className="content">
                          {item.FOUND_DT}
                        </div>
                      </div>
                      <div>
                        <div className="title">
                          上市日期
                                    </div>
                        <div className="content">
                          {item.LST_DT}
                        </div>
                      </div>
                      <div>
                        <div className="title">
                          发行价格
                                    </div>
                        <div className="content">
                          {item.ISS_PRC}元
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          发行数量
                                    </div>
                        <div className="content">
                          {unitConvert(item.ACT_ISS_SHR_ON)}股
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          预计募集资金
                                    </div>
                        <div className="content">
                          {unitConvert(item.TTL_AMT_PLAN)}元
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          实际募集资金
                                    </div>
                        <div className="content">
                          {unitConvert(item.TTL_AMT)}元
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          发行市盈率
                                    </div>
                        <div className="content">
                          {item.PE_WT}倍
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          发行中签率
                                    </div>
                        <div className="content">
                          {unitConvert(item.SUCC_RAT_ON)}%
                                    </div>
                      </div>
                      <div>
                        <div className="title">
                          主承销商
                                    </div>
                        <div className="content">
                          {item.LD_UW}
                        </div>
                      </div>
                      <div>
                        <div className="title">
                          保荐人
                                    </div>
                        <div className="content">
                          {item.SPON}
                        </div>
                      </div>
                      <div>
                        <div className="title">
                          历史沿革
                                    </div>

                      </div>
                    </div>
                    <div className="fxlsBottom">

                      <p className="gsgk">
                        {item.COM_HIS}
                      </p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="contentFlex">
          <div className="logo">
            <img src={`data:image/jpeg;base64,${this.state.ComcnCardData.LOGO}`} />
          </div>
          <div className="fxlsTop">
            <div>
              <div className="title">
                证券名称代码
                            </div>
              <div className="content">
                {this.state.ComcnCardData.SECU_SHT} {this.state.ComcnCardData.TRD_CODE}
              </div>
            </div>
            <div>
              <div className="title">
                公司名称
                            </div>
              <div className="content">
                {this.state.ComcnCardData.COM_NAME}
              </div>
            </div>
            <div>
              <div className="title">
                法人代表
                            </div>
              <div className="content">
                {this.state.ComcnCardData.LGL_REPR}
              </div>
            </div>
            <div>
              <div className="title">
                董事长
                            </div>
              <div className="content">
                {this.state.ComcnCardData.PRESIDENT}
              </div>
            </div>
            <div>
              <div className="title">
                总经理
                            </div>
              <div className="content">
                {this.state.ComcnCardData.GM}
              </div>
            </div>
            <div>
              <div className="title">
                董秘
                            </div>
              <div className="content">
                {this.state.ComcnCardData.DIRE_SECR}
              </div>
            </div>
            <div>
              <div className="title">
                主营业务
                            </div>
              <div className="content">
                {this.state.ComcnCardData.PRI_BIZ}
              </div>
            </div>
            <div>
              <div className="title">
                产品名称
                            </div>
              <div className="content">
                {this.state.ComcnCardData.MAIN_PROD}
              </div>
            </div>
            <div>
              <div className="title">
                官方网站
                            </div>
              <div className="content">
                {this.state.ComcnCardData.WEB_SITE}
              </div>
            </div>
            <div>
              <div className="title">
                联系电话
                            </div>
              <div className="content">
                {this.state.ComcnCardData.TEL}
              </div>
            </div>
            <div>
              <div className="title">
                传真
                            </div>
              <div className="content">
                {this.state.ComcnCardData.FAX}
              </div>
            </div>
            <div>
              <div className="title">
                办公地址
                            </div>
              <div className="content">
                {this.state.ComcnCardData.OFS_ADDR}
              </div>
            </div>
            <div>
              <div className="title">
                邮编
                            </div>
              <div className="content">
                {this.state.ComcnCardData.POSC}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
export default F10WrappedComponent(AboutUs);

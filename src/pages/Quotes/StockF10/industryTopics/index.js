import React, { Component } from "react";
import { formDate4, unitConvert } from "@/utils/FormatUtils";
import { Table } from "antd";
import { Resource } from "@/utils/resource";
import baseConfig from "@/config/F10Config.js";
import _maxBy from 'lodash/maxBy';
import _minBy from 'lodash/minBy';
import _round from 'lodash/round';

import "./style.less";
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';

const PAGEMENU = [{
  name: '市场表现',
  elem: 'scbx'
}, {
  name: '公司规模',
  elem: 'gsgm'
}, {
  name: '估值水平',
  elem: 'gzsp'
},
{
  name: '财务状况',
  elem: 'cwzk'
},
{
  name: '行业研究',
  elem: 'hyyj'
}]

class IndustryTopics extends Component {
  constructor() {
    super();
    this.state = {
      activeIndex: 0,
      data: [],
      news: [],
      maxData: {},
      getScrollTop: ""
    };

  }


 
  async componentWillMount() {
    let obj = [];
    let that = this;
    let re = [];
    re = await Resource.f10_IndStkcnMkt.get("", "", `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then(res => {
      let max = {};
      res.map(item => {
        item.chg_rat_r3m = _round(item.chg_rat_r3m,2);
        item.chg_rat_r6m = _round(item.chg_rat_r6m,2);
        item.chg_rat_rm = _round(item.chg_rat_rm,2);
        item.chg_rat_rw = _round(item.chg_rat_rw,2);
        item.chg_rat_ry = _round(item.chg_rat_ry,2);
        item.day_chg_rat = _round(item.day_chg_rat,2);
      
      });
      return res;
    });
    obj.push(re);
    
    re = await Resource.f10_IndComcnScale.get("", "", `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then(res => {
      res.map(item => {
        item.a_shr_circ = _round(item.a_shr_circ/10000, 2);
        item.fmkt_val = _round(item.fmkt_val/100000000, 2);
        item.tmkt_val = _round(item.tmkt_val/100000000, 2);
        item.ttl_oper_inc = _round(item.ttl_oper_inc/10000, 2);
        item.ttl_shr = _round(item.ttl_shr/10000, 2);
      });
      return res;
    });
    obj.push(re);
    re = await Resource.f10_IndComcnMktQuotIdx.get("", "", `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then(res => {
        
      res.map(item => {
          item.cls_prc = _round(item.cls_prc, 2);
          item.pb = _round(item.pb, 2);
          item.pc = _round(item.pc, 2);
          item.pe = _round(item.pe, 2);
          item.pettm = _round(item.pettm, 2);
        });
        return res;
      });
    obj.push(re);
    re = await Resource.f10_InduComcnFinAnal.get("", "", `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then(res => {
        res.map(item => {
          item.bvps = _round(item.bvps, 2);
          item.eps_bas = _round(item.eps_bas, 2);
          item.net_prof_yoy = _round(item.net_prof_yoy, 2);
          item.roe = _round(item.roe, 2);
          item.roe_wt = _round(item.roe_wt, 2);
          item.sale_npm = _round(item.sale_npm, 2);
        });
        return res;
      });
    obj.push(re);
    this.setState({ data: obj });
    
    Resource.f10_ZxRrpRptAlls.get("", "", `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/0/10`).then(res => {
      const dataResult = res.datalist;
      dataResult.map(item => {
        item.name = "DetailNewsPaper";
      });
      this.setState({ news: dataResult });
    });
  }
  componentDidMount() {
    
  }
  scrollToAnchor(anchorName, index) {
    this.ScrollTop(this.heightList[index - 1], 240);
  }
  ScrollTop(number = 0, time) {
    if (!time) {
      document.getElementById('contentRight').scrollTop = number;
      return number;
    }
    const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime; // 计算循环的次数
    let nowTop = document.getElementById('contentRight').scrollTop; // 获取当前滚动条位置
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
    let scrollTop = document.getElementById('contentRight').scrollTop;
    let offsetHeight = document.getElementById('contentRight').offsetHeight
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

    this.state.data.length > 0 && baseConfig.menu.map((item, index) => {
      // debugger
      if (item.type === "table") {
        item.columns.map(column => {
          if (["rank", "trd_code", "secu_sht"].indexOf(column.dataIndex) === -1) {
            let _maxByData = _maxBy(this.state.data[index], column.dataIndex);
            let _minByData = _minBy(this.state.data[index], column.dataIndex);
            let maxNum = Math.abs(_maxByData[column.dataIndex])> Math.abs(_minByData[column.dataIndex])? Math.abs(_maxByData[column.dataIndex]):Math.abs(_minByData[column.dataIndex])
            column.render = (text, record) => {
              return (
                <div className="percentage" key={index}>
                  <div>{text}</div>
                  <div>
                    <div
                      style={{
                        width: `${parseInt((Math.abs(text) /maxNum) *100)}%`,
                        background: text >= 0 ? "#9B231F" : "#189680",
                        height: "100%"
                      }}
                    />
                  </div>
                </div>
              );
            };
            column.sorter = (a, b) => a[column.dataIndex] - b[column.dataIndex];
          }
          if (column.dataIndex === "rank") {
            column.render = (text, record, index) => {
              return index + 1;
            };
          }
        });
      }
    });

    
    return (
      <div className="F10content">
        <div className="contentLeft">
          {PAGEMENU.map((item, index) => {
            return (
              <dl
                className={index === this.state.activeIndex ? "active" : ""}
                key={index}
              >
                <dt>{index + 1}</dt>
                <dd >
                  <a onClick={(e) => {this.scrollToAnchor(item.elem, index)}} >
                    {item.name}
                  </a>
                </dd>
              </dl>
            );
          })}
          
        </div>
        <div className="contentRight" id="contentRight" onScroll={(e) => this.scrollToActive(e)}>
          {baseConfig.menu.map((item, index) => {
            return (
              <div className="rightList" id={item.elem} key={index}>
                <h2>{item.name}</h2>
                <div className="rightListMain">
                  <div className="tableMain">
                    {item.type === "table" &&
                      this.state.data && (
                        <Table
                          pagination={false}
                          dataSource={this.state.data[index]}
                          columns={item.columns}
                          locale = {{emptyText:'暂无数据'}}
                          className="tableList"
                        />
                      )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rightList" id='hyyj'>
                <h2>行业研究</h2>
                <div className="rightListMain">
                  <div className="tableMain">
                   
                    {this.state.news && this.state.news.map((news, i) => {
                        return (
                          <div
                            className="f12News"
                            onClick={e =>
                              this.props.controller({
                                isShowNewsDetails: true,
                                newsDetailsData: news
                              })
                            }
                            key={i}
                          >
                            <div>{news.tit}</div>
                            <div>{formDate4(news.pub_dt)}</div>
                          </div>
                        );
                      })}
                    {this.state.news && (
                        <div
                          className="more"
                          onClick={e =>
                            this.props.controller({
                              isShowF10NewsListMore: true,
                              F10NewsListMoreData: { defaultActiveKey: "2" }
                            })
                          }
                        >
                          查看更多 >>
                        </div>
                      )}
                  </div>
                </div>
              </div>
        </div>
      </div>
    );
  }
}


export default F10WrappedComponent(IndustryTopics);
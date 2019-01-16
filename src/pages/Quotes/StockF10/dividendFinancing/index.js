import React, { Component } from "react";
import { Table } from "antd";
import baseConfig from "@/config/F10Config.js";
import { Resource } from '@/utils/resource';
import { unitConvert } from '@/utils/FormatUtils'
import './style.less'
import F10WrappedComponent from '@/components/highOrder/F10WrappedComponent';


const PAGEMENU = [{
  name: '分红',
  elem: 'fh'
}, {
  name: '增发',
  elem: 'zf'
}, {
  name: '配股',
  elem: 'pg'
}]
class DividendFinancing extends Component {
  constructor() {
    super();
    this.state = {
      menuCurrentIndex: 0,
      StkcnDvdInfoArr: '',
      StkcnIssArr20: '',
      StkcnIssArr30: '',
    }
  }

  formDate(param) {
    return param ? param.substring(0, 4) + "-" + param.substring(4, 6) + "-" + param.substring(6, 8) : '--';
  }
  StkcnDvdInfoService() {
    Resource.StkcnDvdInfo.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}`).then((data) => {
      console.log('分红', data)
      data.map(item => {
        item.cash_bfr_tax = `10派${(item.cash_bfr_tax * 10).toFixed(2)}元(含税)`
        item.end_dt = (item.end_dt).substr(0, 4)
        item.plan_ntc_dt = this.formDate(item.plan_ntc_dt)
        item.bd_rslt_ntc_dt = this.formDate(item.bd_rslt_ntc_dt)
        item.shm_rslt_ntc_dt = this.formDate(item.shm_rslt_ntc_dt)
        item.impl_ntc_dt = this.formDate(item.impl_ntc_dt)
        item.rt_reg_dt = this.formDate(item.rt_reg_dt)
        item.ex_rd_dt = this.formDate(item.ex_rd_dt)
        item.bt_trd_dt = this.formDate(item.bt_trd_dt)
        item.dvd_pay_dt = this.formDate(item.dvd_pay_dt)

      })
      this.setState({ StkcnDvdInfoArr: data })
    }).catch(err => {

    })
  }

  StkcnIssService() {
    Resource.StkcnIss.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/20`).then((data) => {
      console.log('增发', data)
      data.map(item => {
        item.type = '增发';
        item.plan_ntc_dt = this.formDate(item.plan_ntc_dt)
        item.shm_rslt_ntc_dt = this.formDate(item.shm_rslt_ntc_dt)
        item.aud_rslt_dt = this.formDate(item.aud_rslt_dt)
        item.csrc_chk_dt = this.formDate(item.csrc_chk_dt)
        item.lst_dt = this.formDate(item.lst_dt)
        item.lst_ntc_dt = this.formDate(item.lst_ntc_dt)
      })
      this.setState({ StkcnIssArr20: data })
    }).catch(err => {

    })
    Resource.StkcnIss.post('', '', `${this.props.f10Data.exchange}/${this.props.f10Data.stockCode}/30`).then((data) => {
      console.log('配股', data)
      data.map(item => {
        item.type = '配股';
        item.plan_ntc_dt = this.formDate(item.plan_ntc_dt)
        item.shm_rslt_ntc_dt = this.formDate(item.shm_rslt_ntc_dt)
        item.aud_rslt_dt = this.formDate(item.aud_rslt_dt)
        item.csrc_chk_dt = this.formDate(item.csrc_chk_dt)
        item.lst_dt = this.formDate(item.lst_dt)
        item.lst_ntc_dt = this.formDate(item.lst_ntc_dt)
      })
      this.setState({ StkcnIssArr30: data })
    }).catch(err => {

    })
  }
  componentDidMount() {
    this.StkcnDvdInfoService();
    this.StkcnIssService();
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

  componentDidUpdate() {
    this.getHeightList()
  }

  render() {
    this.state.StkcnIssArr20 && baseConfig.zengfaTable.columns.map((item, index) => {
      if (item.dataIndex === 'programme') {
        item.render = (text, record) => {
          return (
            <div className="percentage">
              <p><span>预案：</span><span>{unitConvert(record.iss_prc_max)}元</span><span>{unitConvert(record.iss_shr_plan_max)}股</span><span>{unitConvert(record.ttl_amt_plan)}元</span></p>
              <p><span>实际：</span><span>{unitConvert(record.iss_prc)}元</span><span>{unitConvert(record.act_iss_shr)}股</span><span>{unitConvert(record.ttl_amt)}元</span></p>
            </div>
          )
        }
      } else if (item.dataIndex === 'process') {
        item.render = (text, record) => {
          return (
            <div className="percentage">
              <ul>
                <li><span>{record.plan_ntc_dt}<br />预案公布</span><span>{record.shm_rslt_ntc_dt}<br />股东大会决议</span><span>{record.aud_rslt_dt}<br />发审委公告</span></li>
                <li><span>{record.csrc_chk_dt}<br />证监会核准公告</span><span>{record.lst_dt}<br />发行新股</span><span>{record.lst_ntc_dt}<br />新股上市公告</span></li>
              </ul>
            </div>
          )
        }
      }
    })
    return (
      <div className="F10content dividendFinancing">
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
        <div className="contentRight" id="scrollContent"  onScroll={(e) => this.scrollToActive(e)}>
          <div className="rightList" id="fh">
            <h2>分红</h2>
            <div className="picshow">
              {
                this.state.StkcnDvdInfoArr && (
                  <Table
                    pagination={baseConfig.fenhongTable.pagination}
                    columns={baseConfig.fenhongTable.columns}
                    dataSource={this.state.StkcnDvdInfoArr}
                    locale = {{emptyText:'暂无数据'}}
                    // scroll={{ y: 400 }}
                    className="tableList"
                  />
                )
              }
            </div>
          </div>
          <div className="rightList" id='zf'>
            <h2>增发</h2>
            <div className="kgcjyj">
              <h3>备注</h3>
              <span>发行方案包括三个要素：发行价格、发行数量、募集资金</span>
            </div>
            <div className="picshow">
              {
                this.state.StkcnIssArr20 && (<Table
                  pagination={baseConfig.zengfaTable.pagination}
                  columns={baseConfig.zengfaTable.columns}
                  dataSource={this.state.StkcnIssArr20}
                  locale = {{emptyText:'暂无数据'}}
                  className="tableList"
                />)
              }

            </div>
          </div>
          <div className="rightList" id='pg'>
            <h2>配股</h2>
            <div className="kgcjyj">
              <h3>配股总结：</h3>
              <span>股前十大流通股东累计持有A、H流通股：--亿股。</span>
            </div>
            <div className="picshow">
              {
                this.state.StkcnIssArr30 && (
                  <Table
                    pagination={baseConfig.zengfaTable.pagination}
                    columns={baseConfig.zengfaTable.columns}
                    dataSource={this.state.StkcnIssArr30}
                    locale = {{emptyText:'暂无数据'}}
                    className="tableList"
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default F10WrappedComponent(DividendFinancing);
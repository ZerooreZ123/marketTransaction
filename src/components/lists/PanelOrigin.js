import React from 'react';
import './PanelOrigin.less';
import { Icon } from 'antd';
import { CompBaseClass } from "@/utils/BaseTools.js";
import PropTypes from "prop-types";

/* ************
 * icon: 图标
 * compName: 组件名, 用于定位配置信息
 * cn: 组件中文名
 * config: 配置信息
 *   width: 组件宽
 *   height: 组件高
 *   hasGroup: 含有组控制器
 *   groupMaster: 标示可以变动actionName的值
 * ***********/
let plugins = [{
  type: 'common',
  name: '通用',
  plugins: [
    {icon: 'option', compName: 'CustomizeSelfOption', cn: '自选', config: {
      width: 400,
      height: 400,
      groupMaster: true,
      hasGroup: true,
    }},
    {icon: 'quicknews', compName: 'CustomizeNewsletter', cn: '快讯', config: {
      width: 400,
      height: 400
    }},
    {icon: 'news', compName: 'CustomizeNews', cn: '要闻', config: {
      width: 400,
      height: 400
    }},
  ]
}, {
  type: 'stockHS',
  name: '沪深',
  plugins: [
    {icon: 'index', compName: 'CustomizeZS', cn: '指数', config: {
      width: 400,
      height: 400
    }},
    {icon: 'kxline', compName: 'CustomizeKX', symbol: 'SH.000001', cn: '日K', config: {
      hasGroup: true,
      hasSearch: true,
      width: 400,
      height: 400
    }},
    {icon: 'fsline', compName: 'CustomizeFS', symbol: 'SH.000001', cn: '分时', config: {
      hasGroup: true,
      hasSearch: true,
      width: 400,
      height: 400
    }},
    {icon: 'underchange', compName: 'CustomizeRankSH', cn: '上证涨跌', config: {
      width: 400,
      height: 400,
      groupMaster: true,
      hasGroup: true,
    }},
    {icon: 'deepchange', compName: 'CustomizeRankSZ', cn: '深证跌跌', config: {
      width: 400,
      height: 400,
      groupMaster: true,
      hasGroup: true,
    }},
  ]
}]

class PanelOrigin extends CompBaseClass {
  constructor(props){
    super(props);
    this.state = {
      currentTab: 0,
      plugin: plugins[0].plugins,
      tabs: Array.from(plugins, item => item.name)
    }
  }

  componentDidMount() {
  }

  tabClick(index){
    this.setState({currentTab: index, plugin: plugins[index].plugins});
  }

  render(){
    return(
      <div
        {...this.props}
        className="panelOrigin"
      >
        <div className="panelBody">
          <div className="panelTabs">
            {
              this.state.tabs.map((name, index) => {
                return (
                  <div
                    key={index}
                    onClick={(e) => this.tabClick(index)}
                    className={`panelTabsItem ${this.state.currentTab === index? 'tabon': ''}`}>
                    {name}
                  </div>
                )
              })
            }
          </div>
          <div className="panelContent">
            {
              this.state.plugin.map((plugin, index) => {
                return (
                  <div
                    key={index}
                    onClick={(e) => this.props.onClickHandler({type: 'loadplugin', setting :plugin})}
                    className="plugin">
                    <div className={`icon-${plugin.icon} plugin-icon`}></div>
                    <div>{plugin.cn}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        {/*<div className="handleBar">
          <Button
            type="primary"
            className="ok"
            onClick={e => this.props.onClickHandler({e, type: 'ok', id: this.props.subCompId})}
          >
            确定
          </Button>
          <Button
            type="primary"
            className="no"
            onClick={e => this.props.onClickHandler({e, type: 'no', id: this.props.subCompId})}
          >
            取消
          </Button>
        </div>*/}
      </div>
    )
  }
}

PanelOrigin.propTypes = {
  onClickHandler: PropTypes.func
}

PanelOrigin.defaultProps = {
  onClickHandler: _ => _
}

export default PanelOrigin;

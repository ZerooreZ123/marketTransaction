import React, { Component } from 'react';
import { MouseEventTool } from '@/utils/BaseTools.js';
import { Icon } from 'antd';
import { barConfig, toolConfig, cycleBarConfig } from '@/components/lists/klineConfig';
import { connect } from 'react-redux';
import {controller, update} from '@/actions/';
import { SmallCompOrigin } from '@/components/lists/SmallCompOrigin';

class KlineChartBar extends MouseEventTool {
  constructor(props) {
    super(props);
    this.state = {
      isShowToolsPanel: false,
      isShowSeterPanel: false
    }
    this.dataValueName = {
      seter: 'klineSeterPanel',
      tools: 'drawLineToolsPanel'
    };
    this.mouseStartInfo = {};
    Object.values(this.dataValueName).forEach(value => this.mouseStartInfo[value] = null);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  getAttribute(e) {
    e.stopPropagation();
    let targetEle = e.currentTarget;
    let tmpObj = { tarEle: [targetEle], type: targetEle.getAttribute("data-type") };
    switch (tmpObj.type) {
      case this.dataValueName.seter:
      case this.dataValueName.tools:
        tmpObj.operType = 'move';
        tmpObj.config = [{
          main: 'left',
          maxData: window.innerWidth - targetEle.scrollWidth,
          minData: 0
        }, {
          main: 'top',
          maxData: window.innerHeight - targetEle.scrollHeight,
          minData: 0
        }];
        break;
    }
    return tmpObj;
  }

  operHandler = ({e, operType, data}) => {
    e.stopPropagation()
    switch (operType) {
      case 'save':
        this.props.saveChartToPng()
        break;
      case 'overlay':
        break;
      case 'tool':
        this.setState(
          prevState => ({ isShowToolsPanel: !prevState.isShowToolsPanel }),
          () => this.addEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.tools}`)
        );
        break;
      case 'hideTool':
        this.props.update({type: 'drawLineData', updateArr: [{enabledName: ''}]})
        this.setState(
          { isShowToolsPanel: false },
          () => this.removeEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.tools}`)
        );
        break;
      case 'smaller':
        this.props.onZoom(1);
        break;
      case 'bigger':
        this.props.onZoom(-1);
        break;
      case 'seter':
        this.setState(
          prevState => ({ isShowSeterPanel: !prevState.isShowSeterPanel }),
          () => this.addEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.seter}`)
        );
        break;
      case 'hideSeter':
        this.setState(
          { isShowSeterPanel: false },
          () => this.removeEvent('mousedown', 'startHandle', `#${this.compId} .${this.dataValueName.seter}`)
        );
        break;
      case 'switchDrawLine':
        const {drawLineData} = this.props;
        if(drawLineData.icon === data.icon){
          this.props.update({type: 'drawLineData', updateArr: [{enabledName: '', icon: ''}]})
          //e.target.style.backgroundColor = '#ffffff';
        }else{
          this.props.update({type: 'drawLineData', updateArr: [{enabledName: data.compType, icon: data.icon}]})
          //e.target.style.backgroundColor = '#b6ddfb';
        }
        break;
    }
  }



  render() {
    const { selectDrawType, newData, quoteInfo, drawLineData } = this.props;
    let newPriceActionName = `${quoteInfo.uuid}-${quoteInfo.exchange === 'INDEX' ? '6' : '5'}`;
    return (
      <div
        className="stockOper"
        id={this.compId}
      >
        <div className="stockInfo">
          {
            this.props.barConfig.name === 'DIVHOUR' && (
              <div className="stockName">
                {quoteInfo.stockName || '股票名称'}
              </div>
            )
          }
          {this.props.children}
          {
            this.props.barConfig.hasStop && (
              <div className="under">
                {
                  quoteInfo && quoteInfo.stockStatus === 0
                    && '停牌中...'
                    || (
                      <SmallCompOrigin
                        actionName={newPriceActionName}
                        type='stockStatus'
                        parseFun={data => data === 0? '停牌中...': ''}
                      />
                    )
                }
              </div>
            )
          }
          {
            this.props.barConfig.hasNewData && (
              <div className="stockNewValue">
                最新
                <SmallCompOrigin
                  actionName={newPriceActionName}
                  defaultData={newData && newData.price}
                  type={'close'}
                />
              </div>
            )
          }
          {
            this.props.barConfig.hasNewData && (
              <div className="stockAvgValue">
                均价
                <SmallCompOrigin
                  actionName={newPriceActionName}
                  defaultData={newData && newData.avgPrice}
                  type={'avgPrice'}
                />
              </div>
            )
          }
        </div>
        <div className="stockBar">
          {
            this.props.barConfig.barConfig.map(name => {
              return name === 'overlay' ?
                '' :
                //<span onClick={(e) => this.operHandler(e, name)}>叠加</span>:
                barConfig[name] && <Icon type={barConfig[name].icon} title={barConfig[name].title} key={name} onClick={(e) => this.operHandler({e, operType: name})} />
            })
          }
          {
            this.props.isShowChartModelRight
            && <Icon type="right-square" theme="outlined" onClick={(e) =>  this.props.controller({isShowChartModelRight: false})}/>
            || <Icon type="left-square" theme="outlined" onClick={(e) =>  this.props.controller({isShowChartModelRight: true})}/>
          }

        </div>
        {
          this.state.isShowSeterPanel && (
            <div
              className="klineSeterPanel"
              data-type={this.dataValueName.seter}
              style={{
                top: this.mouseStartInfo[`${this.dataValueName.seter}_top`],
                left: this.mouseStartInfo[`${this.dataValueName.seter}_left`]
              }}
            >
              <div className="panelTitle">
                <h1>指标设置</h1>
                <Icon type="close" className="closePanel" onClick={(e) => this.operHandler({e, operType: 'hideSeter'})} />
              </div>
            </div>
          )
        }
        {
          this.state.isShowToolsPanel && (
            <div
              className="drawLineToolsPanel"
              data-type={this.dataValueName.tools}
              style={{
                top: this.mouseStartInfo[`${this.dataValueName.tools}_top`],
                left: this.mouseStartInfo[`${this.dataValueName.tools}_left`]
              }}
            >
              <div className="panelTitle">
                <h1>划线工具</h1>
                <Icon type="close" className="closePanel" onClick={(e) => this.operHandler({e, operType: 'hideTool'})} />
              </div>
              <div className="content">
                {
                  toolConfig.map((item, index) => {
                    if (item.icons.length % 3 !== 0) {
                      let overItem = new Array(3 - item.icons.length % 3).fill({});
                      overItem.length > 0 && (item.icons = [...item.icons, ...overItem]);
                    }
                    return (
                      <div className="group" key={index}>
                        <div className="title">{item.title}</div>
                        <ul className="group-icons">
                          {
                            item.icons.map((subItem, subIndex) => {
                              if (!subItem.icon) return (<li key={subIndex} style={{ border: 'none' }}></li>);
                              return (
                                <li
                                  key={subItem.icon}
                                  style={{
                                    backgroundColor: drawLineData.icon === subItem.icon ? '#b6ddfb' : '#ffffff'
                                  }}
                                  onClick={e => this.operHandler({e, operType: 'switchDrawLine', data: subItem})}
                                  data-id={`${index}-${subIndex}`}
                                  className={`${subItem.icon} ${subItem.drawType ? '' : 'disable'}`}
                                  title={subItem.title}>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ) || ''
        }
      </div>
    )
  }
}

KlineChartBar = connect(
  state => ({
    quoteInfo: state.DisplayController.quoteDetailsData,
    isShowChartModelRight: state.DisplayController.isShowChartModelRight,
    drawLineData: state.DisplayController.drawLineData
  }),{controller, update }
)(KlineChartBar);

export { KlineChartBar };

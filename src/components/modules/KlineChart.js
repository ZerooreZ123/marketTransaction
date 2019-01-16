import React, { Component } from 'react';
import {connect} from 'react-redux';
import {message, Icon, Select} from 'antd';
import DetailChartOrigin from '../lists/DetailChartOrigin';
import { Resource } from '@/utils/resource';
import './KlineChart.less';
import history from '@/utils/history.js';
import {controller, pregendataby7, del, add, update, updateconfig} from '@/actions/';
import _cloneDeep from 'lodash/cloneDeep';
import _sortBy from 'lodash/sortBy';
import {
  normBarConfig,
  reinstatementTypeConfig, // 复权因子配置
} from '@/components/lists/klineConfig.js';
import {CompBaseClass} from '@/utils/BaseTools';

class KlineChart extends CompBaseClass{
  constructor(props){
    super(props);
    this.isFirst = true;
    this.quoteDetailsData = this.props.quoteDetailsData || {};
    this.state = {
      activeIndex: this.quoteDetailsData.activeIndex || 0,
      showByIndChart: new Map(),
      showByIndLine: new Map()
    }
    this.state = {...this.state, ...this.defaultSet(this.state.activeIndex, props)};
    this.uuid = this.props.quoteDetailsData.uuid;
    if(!this.uuid && this.props.quoteDetailsData.stockBasic){
      this.uuid = this.props.quoteDetailsData.stockBasic.uuid;
    }
  }

  defaultSet = (index, props) => {
    const {cycleBarConfig, indexConfig} = props;
    let ans = {showByIndChart: new Map(), showByIndLine: new Map()};
    // 只取默认值
    //let defaultNorm = cycleBarConfig[index].defaultNorm;
    // 保留上一次状态
    let defaultNorm = [...this.state.showByIndChart.keys(), ...this.state.showByIndLine.keys()];
    defaultNorm.includes('VOLKX') && defaultNorm.unshift('VOLFS');
    defaultNorm.includes('VOLFS') && defaultNorm.unshift('VOLKX');
    let defaultNormFilter = defaultNorm.filter(key => normBarConfig[index].config.includes(key));
    if(this.isFirst || (defaultNorm.length !== 0 && defaultNormFilter.length === 0)){
      defaultNormFilter = cycleBarConfig[index].defaultNorm;
    }
    defaultNormFilter.forEach(name => {
      let key, config = indexConfig[name];
      switch(config.showType){
        case 'chart':
          key = 'showByIndChart';
          break;
        case 'line':
          key = 'showByIndLine';
          break;
      }
      ans[key].set(name, config);
    })
    //let barConfig = JSON.parse(localStorage.getItem('kline:bar-config')) || {};
    return ans;
  }

  componentDidMount(){
    this.isFirst = false;
  }

  componentWillUnmount(){
  }

  shouldComponentUpdate(){
    return true;
  }

  componentWillReceiveProps(nextProps){
    const {cycleBarConfig, indexConfig} = nextProps;
    if(indexConfig.index !== this.props.indexConfig.index){
      this.setState(prev => ({...this.defaultSet(prev.activeIndex, nextProps)}), _ => {
        this.detailChartNode.isRenderByData = true;
        this.detailChartNode.setState({
          showByIndChart: _sortBy([...this.state.showByIndChart.values()], 'position'),
          showByIndLine: _sortBy([...this.state.showByIndLine.values()], 'position'),
        })
      });
    }
    if(nextProps.quoteDetailsData.isOption !== this.quoteDetailsData.isOption){
      let dindex = window.selfOptions.findIndex(subItem => subItem.uuid === this.quoteDetailsData.uuid);
      this.quoteDetailsData.isOption = false;
      if(dindex > -1){
        this.quoteDetailsData.isOption = true;
        this.quoteDetailsData.isNotDel = window.selfOptions[dindex].isNotDel || false;
      }
    }
    if(nextProps.quoteDetailsData.action !== this.quoteDetailsData.action){
      switch(nextProps.quoteDetailsData.action){
        case 'mainNext':
          // 分时与日k切换
          let nowActiveIndex;
          if(this.state.activeIndex === 0){
            nowActiveIndex = 1;
          }else{
            nowActiveIndex = 0;
          }
          this.handleClick({type: 'showType', index: nowActiveIndex});
          break;
        case 'cycleNext':
          // 周期间切换
          if(this.state.activeIndex < 1 || this.state.activeIndex === cycleBarConfig.length - 1){
            this.handleClick({type: 'showType', index: 1});
          }else{
            this.handleClick({type: 'showType', index: this.state.activeIndex + 1});
          }
          break;
        default:
          this.handleClick({type: 'showType', index: cycleBarConfig.findIndex(item => item.name === nextProps.quoteDetailsData.action)});
      }
    }
  }

  handleClick = ({type, index, norm}) => {
    // 点击事件处理
    const {cycleBarConfig, indexConfig} = this.props;
    switch(type){
      case 'showType':
        if(index === undefined)return;
        this.setState({activeIndex: index, ...this.defaultSet(index, this.props)}, _ => {
        });
        break;
      case 'normType':
        if(!norm)return;
        let indKey, maxItemKey;
        let config = this.props.indexConfig[norm];
        switch(config.showType){
          case 'line':
            indKey = 'showByIndLine';
            maxItemKey = 'maxShowItemByLine';
            break;
          case 'chart':
            indKey = 'showByIndChart';
            maxItemKey = 'maxShowItemByChart';
            break;
        }
        this.setState(prevState => {
          if(prevState[indKey].has(norm)){
            prevState[indKey].delete(norm);
          }else{
            if(prevState[indKey].size >= normBarConfig[prevState.activeIndex][maxItemKey]){
              prevState[indKey].delete([...prevState[indKey].keys()].shift());
            }
            prevState[indKey].set(norm, config);
          }
          this.detailChartNode.setState({[indKey]: _sortBy([...prevState[indKey].values()], 'position')}, _ => { });
          let barConfig = JSON.parse(localStorage.getItem('kline:bar-config')) || {};
          let name = cycleBarConfig[prevState.activeIndex].name;
          barConfig[name] = {...(barConfig[name] || {}), defaultNorm: [...prevState.showByIndLine.keys(), ...prevState.showByIndChart.keys()]};
          localStorage.setItem('kline:bar-config', JSON.stringify(barConfig));
          this.props.updateconfig({type: 'bar'});
          return prevState;
        });
        break;
    }
  }

  operHandler = (e, operType) => {
    switch(operType){
      case 'f10':
        if(this.props.isShowQuoteDetails){
          this.props.controller({f10Data: this.props.quoteDetailsData})
          history.push('/quotes/stockF10/transactionRule/'+ this.props.quoteDetailsData.uuid);
        }else if(window.currentSelectItem){
          this.props.controller({f10Data: window.currentSelectItem})
          history.push('/quotes/stockF10/transactionRule/'+ this.props.quoteDetailsData.uuid);
        }
        history.push('/quotes/stockF10/transactionRule/'+ this.props.quoteDetailsData.uuid);
        break;
      case 'addOption':
        let tip;
        if(this.quoteDetailsData.isOption){
          if(this.quoteDetailsData.isNotDel)return;
          this.quoteDetailsData.isOption = false;
          this.delSelfOption(this.quoteDetailsData);
          tip = '移除自选';
        }else{
          this.quoteDetailsData.isOption = true;
          this.addSelfOption(this.quoteDetailsData);
          tip = '加入自选';
        }
        this.setState({}, _ => message.success(`${this.quoteDetailsData.stockName}(${this.quoteDetailsData.stockCode}) ${tip}`, 1));
        break;
      case 'back':
        this.props.controller({isShowQuoteDetails: false});
        break;
    }
  }

  getHandlerList = () => {
    // 获取上方tab列表及功能按键
    let {isNotDel, isOption} = this.quoteDetailsData;
    const {cycleBarConfig, indexConfig} = this.props;
    return (
      <div className="handlerList">
        <div className="handlerLeft">
          {
            cycleBarConfig.map((item, index) => {
              return (
                <div
                  key={item.title}
                  className={this.state.activeIndex === index? 'active': ''}
                  onClick={() => this.handleClick({type: 'showType', index, norm: item.type})}
                >
                  {item.title}
                </div>
              )
            })
          }
        </div>
        <div className="handlerRight">
          {
            this.state.activeIndex > 0 &&
            <Select
              defaultValue={reinstatementTypeConfig.default}
              className="reinstatement"
              size="small"
              dropdownClassName="reinstatement-option"
              onChange={value => {this.reinstatementType = value; this.detailChartNode.reinstatementChangeHandle(value)}}
            >
              {
                reinstatementTypeConfig.config.map(item => {
                  return (
                    <Select.Option
                      value={item.value}
                      key={item.value}
                    >
                      {item.title}
                    </Select.Option>
                  )
                })
              }
            </Select>
          }
          <div onClick={(e) => this.operHandler(e, 'f10')}>F10</div>
          <div className={isNotDel && 'notUse'} onClick={(e) => !isNotDel && this.operHandler(e, 'addOption')}>
            <Icon type={isOption? 'minus': 'plus'} />
            自选
          </div>
          <div onClick={(e) => this.operHandler(e, 'back')}><Icon type="rollback" />返回</div>
        </div>
      </div>
    )
  }

  getNode(key, node){
    this[key] = node;
  }

  getNormList = () => {
    // 获取指标列表
    const normBar = normBarConfig[this.state.activeIndex];
    return (
      <div className="normList">
        {
          normBar && normBar.config.map((norm, index) => {
            return (
              <div
                key={norm}
                className={this.state.showByIndChart.has(norm) || this.state.showByIndLine.has(norm)? 'active': ''}
                onClick={() => this.handleClick({type: 'normType', index, norm})}
              >{this.props.indexConfig[norm].title}</div>
            )
          })
        }
        {/* <span className="iconMain">
        {
          this.props.isShowChartModelBottom 
          && <Icon type="arrow-down" theme="outlined"  onClick={(e) =>  this.props.controller({isShowChartModelBottom: false})}/>
          || <Icon type="arrow-up" theme="outlined"  onClick={(e) =>  this.props.controller({isShowChartModelBottom: true})}/>
        }
        </span> */}
      </div>
    )
  }

  render(){
    const quoteInfo = this.props.quoteDetailsData;
    const {cycleBarConfig, indexConfig} = this.props;
    return (
      <div className="klineChart">
        { this.getHandlerList() }
        <div style={{width: '100%', height: 'calc(100% - 52px)', overflow: 'hidden'}}>
          {
            cycleBarConfig.map((barConfig, index) => {
              if(this.state.activeIndex === index){
                const actionName = `${quoteInfo.uuid}-${barConfig.type}`;
                return (
                  <DetailChartOrigin
                    key={actionName}
                    myref={node => this.getNode('detailChartNode', node)}
                    {...this.state}
                    barConfig={barConfig}
                    actionName={actionName}
                    isFirst={this.isFirst}
                    cycleBarConfig={cycleBarConfig}
                    hasChartBar={true}
                    axisNumY={5}
                    hasTipPanel={true}
                    panEvent={true}
                    chartSize="big"
                    quoteInfo={quoteInfo}
                    hasReinstatement={index === 0? false: true}
                    showByIndChart={[...this.state.showByIndChart.values()]}
                    showByIndLine={[...this.state.showByIndLine.values()]}
                    sign={this.props.sign}
                    reinstatementType={this.reinstatementType}
                    parentNode={this}
                  />
                )
              }
            })
          }
        </div>
        { this.getNormList() }
      </div>
    )
  }
}
export default connect(
  state => ({
    quoteDetailsData: state.DisplayController.quoteDetailsData,
    isShowQuoteDetails :state.DisplayController.isShowQuoteDetails,
    isShowChartModelBottom: state.DisplayController.isShowChartModelBottom,
    indexConfig: state.DisplayController.indexConfig,
    cycleBarConfig: state.DisplayController.barConfig,
  }), {controller, del, add, update, updateconfig}
)(KlineChart);

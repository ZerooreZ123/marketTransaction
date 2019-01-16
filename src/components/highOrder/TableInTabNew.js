/*Tab切换方法
* TableInTab(component)
* 参数：
*   接受一个参数，参数为一个组件。
* 返回：
*   调用此方法返回以参数组件为tab页面内容的新tab组件。
* props属性：
*   必须带有Tab数组，数组内容为页签的文本，长度为页签数量。
*   必须带有data数组，每一个成员的tabData对象存放对应页签的渲染数据。对象的属性与传入参数组件的props属性一致。
*/
import React,{Component} from 'react';
import { Row, Col, Tabs, Carousel, Popover, Upload, message, Button, Icon } from 'antd';
import {API_HOST, SERVICE_NAME} from '@/config.js';
import { CompBaseClass } from "@/utils/BaseTools.js";
import './TableInTabNew.less';
import csvOption from "@/resources/images/csv-option.png";
import excelOption from "@/resources/images/excel-option.png";
import errorOption from "@/resources/images/error-option.png";
import successOption from "@/resources/images/success-option.png";
import { uploadExchangeTypeConfig } from "./uploadConfig";


export default class NewComponent extends CompBaseClass{
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      actionName: props.actionName[0],
      isActive: false
    }
    this.getUploadConfig = this.getUploadConfig.bind(this);
  }

  componentDidMount(){
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  getUploadConfig(){
    const self = this;
    return {
      accept: '.csv,.xlsx,.xls,.txt',
      action: `${API_HOST}${SERVICE_NAME}/uploadSelfStock`,
      showUploadList:false,
      onChange(info) {
        const {status, name, response={}} = info.file;
        if(status === 'uploading') {
          !self.state.isActive && self.setState({isActive: true});
        }
        if(status === 'done') {
          if(response.code === 'E'){
            message.error(`解析文件${name}异常, 请检查: ${response.info}`);
          }else{
            let badCode = [], goodCode = [], reCode = [];
            response.datalist.forEach(uuid => {
              let stockInfo = window.codelist.data[uuid];
              if(stockInfo){
                if(window.selfOptions.findIndex(item => item.uuid === uuid) === -1){
                  goodCode.push(uuid);
                  self.addSelfOption(stockInfo);
                }else{
                  reCode.push(uuid);
                }
              }else{
                badCode.push(uuid);
              }
            })
            message.success(`文件${name}导入自选, 成功: ${goodCode.length}条, 重复(过滤): ${reCode.length}条, 失败: ${badCode.length}条!${badCode.length && '导入失败股票代码如下: ' + badCode.join(', ') || ''}`);
          }
          self.setState({isActive: false});
        }else if (status === 'error') {
          message.error(`文件${name}导入自选失败!`);
          self.setState({isActive: false});
        }
      }
    }
  }

  onChange(index){
    this.setState({
      index: parseInt(index),
      actionName: this.props.actionName[parseInt(index)]
    });
  }

  getPopoverContent(){
    return (
      <div className="uploadTip" onClick={e => e.stopPropagation()}>
        <Carousel
          autoplay
        >
          <div className="carItem">
            <center>导入文件格式说明</center>
            <p>支持csv, xlsx, xls, txt文件的数据导入;</p>
            <p>请每次单文件上传导入;</p>
            <p>数据分三列, 交易所、代码和名称(非必填);</p>
            <p>txt与csv文件导入样例:</p>
            <img src={csvOption} />
            <p>excel文件导入样例:</p>
            <img src={excelOption} />
          </div>
          <div className="carItem">
            <center>交易市场对应对应码</center>
            <div className="carItemContent">
              {
                uploadExchangeTypeConfig.map((item, index) => {
                  return (
                    <Row type="flex" key={item.name} style={{margin: '.3em'}}>
                      <Col span={6} style={{textAlign: 'right'}} >{index + 1}.</Col>
                      <Col span={6} style={{textAlign: 'right'}} >{item.name}</Col>
                      <Col span={11} push={1}>{item.title}</Col>
                    </Row>
                  )
                })
              }
            </div>
          </div>
          <div className="carItem">
            <center>提示</center>
            <p>解析失败提示: 解析文件 文件名 异常, 请检查: 第1行错误原因;第二行错误原因;...第n行错误原因;</p>
            <img src={errorOption} width="100%" />
            <p>导入成功提示: 文件 文件名 导入自选, 成功: X条, 重复(过滤): Y条, 失败: Z条! (如果有导入失败项则会输出失败项的股票代码)</p>
            <img src={successOption} width="100%" />
          </div>
        </Carousel>
      </div>
    )
  }

  render(){
    const Comp = this.props.comp;
    return (
      <div
        className="tableInTab"
        style={{width: '100%', height: '100%'}}>
        {
          this.props.tableProps && this.props.tableProps.tableType === 'option' && (
            <div className="upLoad">
              <Upload {...this.getUploadConfig()}>
                <Popover
                  placement="topLeft"
                  content={this.getPopoverContent()}
                  title={null}
                  overlayClassName="uploadTipBox"
                >
                  <Button disabled={this.state.isActive} >
                    <Icon type={this.state.isActive? "loading": "upload"} />
                    {this.state.isActive? '导入中': '导入'}
                  </Button>
                </Popover>
              </Upload>
            </div>
          )
        }
        <Tabs
          clssName='myTabList'
          onChange={(index) => this.onChange(index)}
          renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} onKeyDown={e => e}/>}
          type='card'>
          {
            this.props.tabTitle.map((value, index) => {
              return (
                <Tabs.TabPane
                  style={{width: '100%', height: '100%'}}
                  tab={value}
                  key={index}>
                  {
                    this.state.index === index?
                    <Comp
                      ref={node => this.compNode = node}
                      activeIndex={index}
                      {...this.props}
                      actionName={this.props.actionName[this.state.index]}
                    />
                    : ''
                  }
                </Tabs.TabPane>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}

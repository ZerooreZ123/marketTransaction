//import {message} from 'antd';
import React,{Component} from 'react';

const BaseTableColumns = [
  { title: '序号', isSorter:false, dataIndex: 'order',  width: 50, },
  { title: '代码', dataIndex: 'code',   width: 80, },
  { title: '名称', dataIndex: 'name',  width: 80, },
  { title: '涨幅', dataIndex: 'rise',  width: 80, },
  { title: '现价', dataIndex: 'prise', width: 80, },
  { title: '涨跌', dataIndex: 'orderChange', width: 80, },
  { title: '成交量', dataIndex: 'volume', width: 80, },
  { title: '市盈率', dataIndex: 'PEratio',width: 80, },
  { title: '振幅', dataIndex: 'amplitude', width: 80, },
  { title: '委差', dataIndex: 'disparity', width: 80, },
  { title: '委比', dataIndex: 'vabi', width: 80, },
  { title: '内盘', dataIndex: 'inPlate', width: 80, },
  { title: '外盘', dataIndex: 'outPlate', width: 80, },
  { title: '换手', dataIndex: 'changeHand', width: 80, },
  { title: '涨速', dataIndex: 'inSpeed', width: 80, },
  { title: '成交额', dataIndex: 'turnover',width: 80, },
  { title: '今开', dataIndex: 'todayOpen', width: 80, },
  { title: '最高', dataIndex: 'highest', width: 80, },
  { title: '最低', dataIndex: 'lowest',width: 80, },
  { title: '昨收', dataIndex: 'yesClose', width: 80, },
  { title: '净资', dataIndex: 'netcapital', width: 80, },
  { title: '总股本', dataIndex: 'totalCapital', width: 80, },
  { title: '流通股', dataIndex: 'circulating',width: 80, },
  { title: '买价', dataIndex: 'buyPrice',width: 80, },
  { title: '卖价', dataIndex: 'sellPrice',width: 80, },
  { title: '总量', dataIndex: 'totalAmount', width: 80, },
  { title: '现量', dataIndex: 'nowAmount',width: 80, }
]

const BaseTableColumnsTest = [
  { title: '交易所', dataIndex: 'exchange', width: 80, },
  { title: '代码', dataIndex: 'stockCode', width: 80, },
  { title: '名称', dataIndex: 'stockName', width: 80, },
  { title: '交易日期', dataIndex: '', width: 80, },
  { title: '交易时间', dataIndex: 'time', width: 80, },
  { title: '现价', dataIndex: 'close', width: 80, },
  { title: '涨跌', dataIndex: 'netChangeRatio', width: 80, },
  { title: '涨跌幅', dataIndex: 'netChangeRatio', width: 80, },
  { title: '复权', dataIndex: 'mode', width: 80, },
  { title: '开始日期', dataIndex: 'startDate', width: 80, },
  { title: '开始时间', dataIndex: 'startTime', width: 80, },
  { title: '数量', dataIndex: 'count', width: 80, },
  { title: '开盘价', dataIndex: 'open', width: 80, },
  { title: '最高价', dataIndex: 'high', width: 80, },
  { title: '最低价', dataIndex: 'low', width: 80, },
  { title: '收盘价', dataIndex: 'close', width: 80, },
  { title: '涨跌', dataIndex: 'netChange', width: 80, },
  { title: '涨跌幅', dataIndex: 'netChangeRatio', width: 80, },
  { title: '交易量', dataIndex: 'volume', width: 80, },
  { title: '成交额(元)', dataIndex: 'amount', width: 80, },
  { title: '换手率', dataIndex: 'turnoverRatio', width: 80, },
  { title: '昨收', dataIndex: 'preClose', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
  { title: '', dataIndex: '', width: 80, },
]

let Handler = function(){
  // column数据容器
  const baseColumnsObj = {};

  BaseTableColumns.forEach(item => {
    // 初始化查询对象
    item.key = item.dataIndex;
    item.sorter = (a, b) => a[item.dataIndex] - b[item.dataIndex];
    baseColumnsObj[item.title] = baseColumnsObj[item.dataIndex] = item;
    if(['rise', 'orderChange', 'prise'].indexOf(item.dataIndex) > -1){
      item.render = (text, record, index) => {
        return (
          <div style={{
            color: record.rise > 0? '#e22324': '#02a263'
          }}>{text}</div>
        )
      }
    }
    if(['volume', 'turnover'].indexOf(item.dataIndex) > -1){
      item.render = (text, record, index) => {
        return (
          <div style={{
            color: '#e7940c'
          }}>{text}</div>
        )
      }
    }
  });

  this.getColumns = (configInfo) => {
    /* **************
     * 根据configInfo返回对应的column
     * params:
     *   configInfo: []
     * *************/
    if((configInfo instanceof Array) && configInfo.length > 0){
      let ans = [];
      configInfo.forEach(item => {
        if(item.constructor == String){
          baseColumnsObj[item] && (ans.push({...baseColumnsObj[item]}));// || (message.info('字段不存在'));
        }else if((item.constructor == Object) && item.main){
          if(baseColumnsObj[item.main]){
            let temp = {...baseColumnsObj[item.main]};
            Object.entries(item).forEach(([key, value], index) => {
              switch(key){
                case 'main':
                  break;
                case 'isSorter':
                  if(value === false)delete temp['sorter']
                  break;
                default:
                  temp[key] = value;
              }
            })
            ans.push(temp);
          }else{
            ans.push(item);
          }
        }
      })
      return ans;
    }else{
      return [false, '参数错误'];
    }
  }
}

const handler = window.handler? window.handler: new Handler();
if(!window.handler)window.handler = handler;

export default handler;

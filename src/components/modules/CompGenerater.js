import config from './Config.js';
import React from 'react';
import TableCommon from '@/components/lists/TableCommon';
import TableOption from '@/components/lists/TableOption';
import ChangeOrigin from '@/components/lists/ChangeOrigin';
import ChartOrigin from '@/components/lists/ChartOrigin';
import NewsOrigin from '@/components/lists/NewsOrigin';
import TableInTab from '@/components/highOrder/TableInTabNew';
import TableInTabUpper from '@/components/highOrder/TableInTabUpper';
//import ErrorBoundary from '@/components/lists/ErrorBoundaryOrigin';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import {message} from 'antd';

export default function CompGenerater (props){
  if(!props)props = {};
  let compConfig, actionName = [];
  if(props.name){
    compConfig = _cloneDeep(config[props.name]);
    if(props.actionName && props.actionName.constructor === String){
      actionName = props.actionName;
    }else{
      if( props.actionName){
        if(props.actionName.length < compConfig.actionName.length){
          props.actionName.length > 0
          && compConfig.tabTitle
          && (actionName = (new Array(compConfig.tabTitle.length)).fill(props.actionName.constructor === String? props.actionName: props.actionName[0]));
        }else{
          actionName = props.actionName;
        }
      }
    }
    actionName.length === 0 && (actionName = compConfig.actionName);
    if(!compConfig){
      message.error('name参数未找到对应组件配置信息!')
    }
    compConfig = _merge(compConfig || {}, {...props, actionName});
  }else{
    compConfig = _cloneDeep(props);
  }
  let compErrorTip = (config, tip) => {
    return (
      <div style={{color: 'red', fontSize: '20px', height: '100%', padding: '10px'}}>
        {
          tip?<div>{tip}</div>
          :<div> 组件加载失败, 请检查name值是否正确, 且配置信息必须包含compType 和 actionName, actionName 为数组 </div>
        }
        <br/>
        <div> 参数值: {JSON.stringify(config)} </div>
      </div>
    )
  }
  if(Object.keys(compConfig).length === 0
    || !compConfig.compType
    || !compConfig.actionName
    || (compConfig.actionName.constructor === Array && compConfig.actionName.length === 0)){
    return compErrorTip(compConfig);
  }
  let Comp;
  switch(compConfig.compType){
    case 'table':
      //Comp = TableOrigin;
      //Comp = TableBase;
      if(!compConfig.tableProps.tableType || compConfig.tableProps.tableType === 'common'){
        Comp = TableCommon;
      }else{
        Comp = TableOption;
      }
      break
    case 'change':
      Comp = ChangeOrigin;
      break
    case 'chart':
      Comp = ChartOrigin;
      break
    case 'news':
      Comp = NewsOrigin;
      break
  }
  if(!Comp)return compErrorTip(compConfig, '错误项: compType');
  if(compConfig.tabTitle){
    if(!compConfig.tabMap){
      return <TableInTab comp={Comp} {...compConfig}/>
    }else{
      return <TableInTabUpper comp={Comp} {...compConfig}/>
    }
  }
  return (
    <Comp {...compConfig}/>
  )
}

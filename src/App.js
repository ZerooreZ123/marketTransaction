import React, { Component } from 'react';
import {Route, Switch, NavLink, Redirect} from 'react-router-dom';

import ComprehensivePlate from './pages/Quotes/ComprehensivePlate';
import OptionalStock from './pages/Quotes/OptionalStock';
import QuotationList from './pages/Quotes/QuotationList';
import Customize from './pages/Quotes/Customize/Customize';
import Customize2 from './pages/Quotes/Customize/Customize_su';
import BoardQuotes from './pages/Quotes/BoardQuotes';
import StockF10 from './pages/Quotes/StockF10';
import RootComp from './pages/rootComp';

import history from './utils/history';
import { ConnectedRouter } from 'connected-react-router';

import {Resource} from '@/utils/resource';
import config from '@/config.js';
import {Spin } from 'antd';
import {KeyBoardTools} from '@/components/lists/otherConfig';
import LoadOrigin from '@/components/lists/LoadOrigin';
const pako = require('pako');

function Blank(props){
  return '';
}

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <LoadOrigin/>;
    }
  }

  return AsyncComponent;
}

// const ComprehensivePlate = asyncComponent(() => import(/*webpackChunkName:"ComprehensivePlate"*/"./pages/Quotes/ComprehensivePlate"));
// const OptionalStock = asyncComponent(() => import(/*webpackChunkName:"OptionalStock"*/"./pages/Quotes/OptionalStock"));
// const QuotationList = asyncComponent(() => import(/*webpackChunkName:"QuotationList"*/"./pages/Quotes/QuotationList"));
// const Customize = asyncComponent(() => import(/*webpackChunkName:"Customize"*/"./pages/Quotes/Customize/Customize"));
// const Customize2 = asyncComponent(() => import(/*webpackChunkName:"Customize2"*/"./pages/Quotes/Customize/Customize_su"));
// const BoardQuotes = asyncComponent(() => import(/*webpackChunkName:"BoardQuotes"*/"./pages/Quotes/BoardQuotes"));
// const StockF10 = asyncComponent(() => import(/*webpackChunkName:"StockF10"*/"./pages/Quotes/StockF10"));

// 入口页面以及路由
class App extends Component{
  constructor(props, context){
    super(props);
    this.state = {
      IsFethCodeList: config.isFetchCodeList,
      CodeListUrl :config.CodeListUrl,
      PROTO_PATH :config.PROTO_PATH
    }
    console.log(history);
    let tmp = history.location.search.replace('?', '');
    this.search = {};
    if(tmp !== ''){
      tmp.split('&').forEach(item => {
        let [key, val] = item.split('=');
        this.search[key] = val;
      });
    }
  }

  serviceCodeList(data){
    let tmpData = {}, tmpCode = [], tmpPy = [], tmpName = [], tmpTool = [];
    data =JSON.parse(pako.ungzip(data, { to: 'string' } )); // 解
    data.forEach((item, index) => {
      let temp = `${item.stockCode}-${index}`;
      item.index = index;
      tmpData[temp] = item;
      tmpData[item.uuid] = tmpData[temp];
      tmpData[`${item.stockName}-${index}`] = temp;
      tmpData[`${item.stockpysht}-${index}`] = temp;
      tmpCode.push(temp);
      tmpPy.push(`${item.stockpysht}-${index}`);
      tmpName.push(`${item.stockName}-${index}`);
    });
    KeyBoardTools.forEach(tool => {
      tmpData[tool.command] = tool.uuid && {...tmpData[tool.uuid], ...tool} || tool;
      tmpTool.push(tool.command);
      tool.maps.forEach(py => (tmpData[py] = tool.command, tmpTool.push(py)));
    })
    window.codelist = {data: tmpData, keys: [...tmpTool, ...tmpCode, ...tmpPy, ...tmpName]};
    !this.state.IsFethCodeList && this.setState({IsFethCodeList : true});
  }
  codelistByGZFn(){
    Resource.codelistByGZ.post('','','').then((data) => {
      localStorage.setItem("codeList",data);
      this.serviceCodeList(data);
    }).catch(err => {
      // throw new Error(err);
    });
  }

  componentDidMount(){
    window.store.dispatch({type: 'INIT'});
    var data = window.localStorage.getItem("codeList");
    if (data != null) {
      this.serviceCodeList(data);
      this.codelistByGZFn();
    }else{
      this.codelistByGZFn();
    }
  }


  routeDom(){
    let search = history.location.search;
    return (
      <div className="contentOuter">
        <ConnectedRouter history={history}>
          <div className='homeContent'>
            {
              this.search['hasmenu'] && this.search['hasmenu'] !== '0' && (
                <ul className='menu'>
                  <li>
                    <NavLink
                      to={'/quotes/comprehensivePlate' + search}
                      activeClassName='active'>
                      综合板块
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={'/quotes/optionalStock' + search}
                      activeClassName='active'>
                      自选
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={'/quotes/quotationList' + search}
                      activeClassName='active'>
                      行情列表
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={'/quotes/boardQuotes' + search}
                      activeClassName='active'>
                      板块行情
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={'/quotes/customize' + search}
                      activeClassName='active'
                    >
                      自定义面板
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={'/quotes/customize2' + search}
                      activeClassName='active'
                    >
                      自定义面板2
                    </NavLink>
                  </li>
                </ul>
              )
            }

            <Switch>
              <Route
                path='/blank'
                component={Blank}
              />
              <Route
                path='/quotes/comprehensivePlate'
                component={ComprehensivePlate}
              />
              <Route
                path='/quotes/optionalStock'
                component={OptionalStock}
              />
              <Route
                path='/quotes/quotationList'
                component={QuotationList}
              />
              <Route
                path='/quotes/customize'
                component={Customize}
              />
              <Route
                path='/quotes/customize2'
                component={Customize2}
              />
              <Route
                path='/quotes/boardQuotes'
                component={BoardQuotes}
              />
              <Route
                path='/quotes/stockF10'
                component={StockF10}
              />
              <Redirect
                path='/'
                to='/quotes/comprehensivePlate'
              />
              <Route component={Error} />
            </Switch>
            <RootComp/>
          </div>
        </ConnectedRouter>
      </div>
    )
  }

  render (){
    return (
      <div className="panel">
        {
          this.state.IsFethCodeList
            && this.routeDom()
            || <LoadOrigin/>
        }
      </div>
    )
  }
}
export default App

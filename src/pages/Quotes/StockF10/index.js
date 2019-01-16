import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import './style.less';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import TransactionRule from './transactionRule';
import AboutUs from './aboutUs';
import ShareHolders from './shareHolders';
import FinancialCapitalManagement from './financialCapitalManagement';
import DividendFinancing from './dividendFinancing';
import IndustryTopics from './industryTopics';
import ValuationForecast from './valuationForecast';
import history from '@/utils/history'

const MENUROUTE = [
  {
    name: '交易必读',
    path: 'transactionRule'
  }, {
    name: '公司介绍',
    path: 'aboutUs'
  }, {
    name: '股本股东',
    path: 'shareHolders'
  }, {
    name: '财务资本经营',
    path: 'financialCapitalManagement'
  }, {
    name: '分红融资配股',
    path: 'dividendFinancing'
  }, {
    name: '行业专题',
    path: 'industryTopics'
  }, , {
    name: '估值及预测',
    path: 'valuationForecast'
  },
]
class stockF10 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockName: '',
      currentIndex: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    let stockName = window.codelist.data[nextProps.f10Data.uuid].stockName
    this.setState(prev => {
      prev.stockName = stockName;
      return prev
    })
  }

  linkTo(link, index) {
    this.setState({ currentIndex: index })
    if (link) {
      history.replace(link);
    }
  }
  componentDidMount() {
    MENUROUTE.map((item, index) => {
      console.log(history.location.pathname.indexOf(item.path))
      if (history.location.pathname.indexOf(item.path) > -1) {
        this.setState({ currentIndex: index })
        return;
      }
    })
  }
  render() {
    return (
      <div className='stockF10'>
        <div className="backBox">
          <span onClick={e => history.goBack()}>
          <Icon type="rollback" theme="outlined" />
            返回
                    </span>
        </div>
        <div className="topBox">
          <div className="stock">
            <span className="stockName">{this.state.stockName}</span><span className="stockCode">{this.props.f10Data.stockCode}</span>
          </div>
          {/* <div className="searchStock">
                        <div>
                            <input type="text" placeholder="输入股票代码" />
                        </div>
                    </div> */}
          <div className="stockMenu">
            {
              <ul>
                {
                  MENUROUTE.map((item, index) => {
                    return (
                      <li key={index} className={index === this.state.currentIndex ? 'active' : ''} onClick={e => this.linkTo(`/quotes/stockF10/${item.path}/${this.props.f10Data.uuid}`, index)}>
                        {item.name}
                      </li>
                    )
                  })
                }
              </ul>
            }
          </div>
        </div>
        <div className='bottomBox'>
          <div>
            <Switch>
              <Route
                exact
                path='/quotes/stockF10/transactionRule/:uuid'
                component={TransactionRule}
              />
              <Route
                exact
                path='/quotes/stockF10/aboutUs/:uuid'
                component={AboutUs}
              />
              <Route
                exact
                path='/quotes/stockF10/shareHolders/:uuid'
                component={ShareHolders}
              />
              <Route
                exact
                path='/quotes/stockF10/financialCapitalManagement/:uuid'
                component={FinancialCapitalManagement}
              />
              <Route
                exact
                path='/quotes/stockF10/dividendFinancing/:uuid'
                component={DividendFinancing}
              />
              <Route
                exact
                path='/quotes/stockF10/industryTopics/:uuid'
                component={IndustryTopics}
              />
              <Route
                exact
                path='/quotes/stockF10/valuationForecast/:uuid'
                component={ValuationForecast}
              />
              <Redirect
                exact
                path='/quotes/stockF10'
                to='/quotes/stockF10/transactionRule'
              />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({ f10Data: state.DisplayController.f10Data }), {}
)(withRouter(stockF10));
import React, { Component } from 'react';
import { Tabs } from 'antd'
import './index.less';
// import FivePriceList2 from '../../../components/lists/FivePriceList2';
import FivePriceList from '../../../components/lists/FivePriceList';
import CompGenerater from '@/components/modules/CompGenerater';

export default class OptionalStock extends Component{
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      myActionName: 'SH.600999-7-6',
      JJActionName : 'SH.600999-7-6',
      JJActionName2 : 'SH.600999-5',
    }
    this.tabTitles = [{
      tabtitle: '沪深股票',
      tabIndex: 0
    // },{
    //   tabtitle: '港股',
    //   tabIndex: 1
    // },{
    //   tabtitle: '期货',
    //   tabIndex: 2
    // },{
    //   tabtitle: '期权',
    //   tabIndex: 3
    },{ 
      tabtitle: '基金',
      tabIndex: 4
    },{ 
      tabtitle: '债券',
      tabIndex: 5
    }
  ]
      // '沪深股票', '港股', '期货', '期权', '基金', '债券'];
  }

  componentDidMount() {

  }

  onChange(index){
    this.setState({index: parseInt(index)});
  }

  generateTabBody(index){
    if(index === 0 || index === 1 || index === 5){
      return (
        <div className="tabBody">
          <div className="topList">
            {
              index === 0 && ['ListHSGPChartShZZS', 'ListHSGPChartSzZZS', 'ListHSGPChartCYBZS'].map(name => {
                return (
                  <div key={name} className="topListChart">
                    <CompGenerater name={name}/>
                  </div>
                )
              })
            }
            {
              index === 1 && ['ListHSGPChartShZZS', 'ListHSGPChartSzZZS', 'ListHSGPChartCYBZS'].map(name => {
                return (
                  <div key={name} className="topListChart">
                    <CompGenerater name={name}/>
                  </div>
                )
              })
            }
            {
              index === 5 && ['ListHSGPChartGZZS', 'ListHSGPChartGSZS', 'ListHSGPChartZZZZ'].map(name => {
                return (
                  <div key={name} className="topListChart">
                    <CompGenerater name={name}/>
                  </div>
                )
              })
             
            }
          </div>
          <div className="bottomList">
            <div className="bottomListLeft">
              { index === 0 && <CompGenerater name='ListHSGPTable' 
                tableProps={{
                  onRow: {
                    onChangeHandle: ({data, index, dataIndex}) => {
                      this.setState({myActionName: [data.uuid + '-7-6',data.uuid + '-13-6']});
                    }
                  }
                }}
              /> }
              { index === 1 && <CompGenerater name='ListGGTable' 
                tableProps={{
                  onRow: {
                    onChangeHandle: ({data, index, dataIndex}) => {
                      this.setState({myActionName:  [data.uuid + '-7-6',data.uuid + '-13-6']});
                    }
                  }
                }}
              /> }
              { index === 5 && <CompGenerater name='ListZQTable'  
                tableProps={{
                  onRow: {
                    onChangeHandle: ({data, index, dataIndex}) => {
                      this.setState({myActionName:  [data.uuid + '-7-6',data.uuid + '-13-6']});
                    }
                  }
                }}
              /> }
            </div>
            <div className="bottomListRight">
              <div className="bottomListChart">
                <CompGenerater name='ListHSGPChartFS' actionName={this.state.myActionName[1]}/>
              </div>
              <div className="bottomListChart">
                <CompGenerater name='ListHSGPChartKX' actionName={this.state.myActionName[0]}/>
              </div>
            </div>
          </div>
        </div>
      )
    }else if(index === 2){
      return(
        <div className="tabBodyQH">
          <div className="topList">
            <CompGenerater name='ListQHTable'/>
          </div>
          <div className="bottomList">
            <div className="bottomListChartLeft">
              <CompGenerater name='ListHSGPChartFS'/>
            </div>
            <div className="bottomListMid">
              <FivePriceList />
            </div>
            <div className="bottomListChartRight">
              <CompGenerater name='ListHSGPChartFS'/>
            </div>
          </div>
        </div>
      )
    }else if(index === 3){
      return(
        <div className="tabBodyQQ">
          <div className="topList">
            <div className="topListTable">
              <CompGenerater name='ListQQTable'/>
            </div>
            <div className="topListChart">
              <CompGenerater name='ListHSGPChartFS'/>
            </div>
          </div>
          <div className="midList">
            <CompGenerater name='ListQQTable'/>
          </div>
          <div className="bottomList">
            <div className="bottomListChartLeft">
              <CompGenerater name='ListHSGPChartFS'/>
            </div>
            <div className="bottomListMid">
              <FivePriceList />
            </div>
            <div className="bottomListChartRight">
              <CompGenerater name='ListHSGPChartFS'/>
            </div>
          </div>
        </div>
      )
    }else if(index === 4){
      return (
        <div className="tabBodyJJ">
          <div className="topList">
            <CompGenerater name='ListJJTable'
               tableProps={{
                onRow: {
                  onChangeHandle: ({data, index, dataIndex}) => {
                    this.setState({JJActionName: data.uuid + '-13-6',JJActionName2: data.uuid + '-5'});
                  }
                }
              }}
            />
          </div>
          <div className="bottomList">
            <div className="bottomListLeft">
              <FivePriceList  actionName={this.state.JJActionName2} actionPage={'optionStock'}/>
            </div>
            <div className="bottomListRight">
              <CompGenerater actionName = {this.state.JJActionName} name='ListHSGPChartFS'/>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='quotationList'>
        <Tabs
          clssName='myTabList'
          onChange={(index) => this.onChange(index)}
          type='card'>
          {
            
            this.tabTitles.map((value, index) => {
              return (
                <Tabs.TabPane
                  style={{width: '100%', height: '100%'}}
                  tab={value.tabtitle}
                  key={index}>
                  {
                    this.state.index === index?
                      this.generateTabBody(this.tabTitles[index].tabIndex)
                      : ''
                  }
                </Tabs.TabPane>
              )
            })
        }
        </Tabs>
      </div>
    );
  }
}

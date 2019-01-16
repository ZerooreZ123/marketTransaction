import React, { Component } from 'react';
import './style.less';

import CompGenerater from '@/components/modules/CompGenerater';

export default class BoardQuotes extends Component{
    constructor(){
        super();
      this.state = {
        tableTwoActionName: '',
        chartOneActionName: '',
        chartTwoActionName: '',
      }
    }
    render (){
        return (
            <div className='boardQuotes'>
                <div className="topBox">
                    <div className='stockList'>
                      <CompGenerater name='BoardTableOne'
                        tableProps={{
                            onRow: {
                                onChangeHandle: ({data, index, dataIndex}) => {
                                  this.setState({tableTwoActionName: data.uuid + '-19', chartOneActionName: [data.uuid + '-7-6',data.uuid + '-13-6']})
                                }
                            }
                        }}
                      />
                    </div>
                    <div className='stockList'>
                      <CompGenerater name='BoardChartOne'
                        actionName={this.state.chartOneActionName}
                      />
                    </div>
                </div>
                <div className='bottomBox'>
                    <div className='stockList'>
                      <CompGenerater name='BoardTableTwo'
                        actionName={this.state.tableTwoActionName}
                        tableProps={{
                            onRow: {
                                onChangeHandle: ({data, index, dataIndex}) => {
                                  this.setState({chartTwoActionName: [data.uuid + '-7-6',data.uuid + '-13-6']})
                                }
                            }
                        }}
                      />
                    </div>
                    <div className='stockList'>
                      <CompGenerater name='BoardChartTwo'
                        actionName={this.state.chartTwoActionName}
                      />
                    </div>
                </div>
            </div>
        )
    }
}

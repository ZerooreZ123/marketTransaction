import React, { Component } from 'react';
import { CompBaseClass } from "@/utils/BaseTools.js";
import CompGenerater from '@/components/modules/CompGenerater';
import { Resource } from '@/utils/resource'
import { connect } from 'react-redux';
import { glbj, dataupdate } from '@/actions';

class GlbjOrigin extends CompBaseClass {
  constructor(props) {
    super(props);
    this.state = {
      actionName: ''
    }
  }

  componentWillUnmount() {
    this.props.dataupdate({type: 'glbj-ALL', data: null});
    window.glbjList = [];
  }

  componentDidMount() {
    Resource.stkcnsectmemberlist.post({ exchange: this.props.quoteDetailsData.exchange, stockcode: this.props.quoteDetailsData.stockCode }, '', '').then((data) => {
      console.log('关联报价', data)
      window.glbjList = data;
      let glbjArr = [];
      data.map((item, index) => {
        let obj = {};
        obj.symbol = `${'INDEX'}.${item.sectid}`;
        obj.dataType = '6';
        obj.uuid = obj.symbol;
        obj.stockName = item.sectname;
        obj.stockCode = item.sectid;
        window.glbjList[index]['uuid'] = obj.symbol
        glbjArr.push(obj)
      })
      this.props.glbj({ type: 'glbj-ALL', data: glbjArr, count: glbjArr.length, startNum: 0, isPreData: true });
      this.emitEvent(glbjArr)
      console.log(glbjArr)
    }).catch(err => {
    })
  }

  render() {
    return (
      <div className='glbjContent'>
        <div className='glbjListLeft'>
          <CompGenerater name={'DetailTableGLBJ'}
            tableProps={{
              onRow: {
                onChangeHandle: ({ data, index, dataIndex }) => {
                  this.setState({ actionName: data.uuid + '-19' });
                }
              }
            }}
          />
        </div>
        <div className='glbjListRight'>
          <CompGenerater name={'DetailTableGLBJ2'} actionName={this.state.actionName} />
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({ data: state.Data, quoteDetailsData: state.DisplayController.quoteDetailsData }), { glbj, dataupdate }
)(GlbjOrigin);

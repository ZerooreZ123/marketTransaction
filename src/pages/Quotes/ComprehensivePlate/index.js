import React, { Component } from 'react';
import './style.less';
import CompGenerater from '@/components/modules/CompGenerater';

export default class ComprehensivePlate extends Component{
  constructor(){
    super();
    this.state = {
      myActionName: []
    }
  }

  updateSelect(e, compId, index){
    let ele;
    [...document.querySelectorAll('.changeOrigin .selected'), ...document.querySelectorAll('.TableOrigin .selected')].forEach(ele => {
      ele.classList.remove('selected');
    })
    if(compId){
      (ele = document.querySelectorAll(`#${compId} .TbodyInner .brief tr`), ele.length > index && ele[index].classList.add('selected'));
      (ele = document.querySelectorAll(`#${compId} .TbodyInner .detailOuter tr`), ele.length > index && ele[index].classList.add('selected'));
    }else{
      e.currentTarget.classList.add('selected');
    }
  }

  render (){
    return (
      <div className='chineseStocks'>
        <div className="topBox">
          <div className='stockList'>
            <CompGenerater name={'ComplexChartHSB'}/>
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexChartSZCSC'}/>
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexChartHH'}/>
          </div>
        </div>
        <div className='middleBox'>
          <div className='stockList'>
            <CompGenerater name={'ComplexRankShZAG'}
              changeProps={{
                onRow: {
                  onClick: ({data: item, index, type, e}) => {
                    this.updateSelect(e);
                    this.setState({myActionName: [item.stockBasic.uuid + '-7-6',item.uuid + '-13-6']})
                  }
                }
              }}
            />
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexRankSzZAG'}
              changeProps={{
                onRow: {
                  onClick: ({data: item, index, type, e}) => {
                    this.updateSelect(e);
                    this.setState({myActionName: [item.stockBasic.uuid + '-7-6',item.uuid + '-13-6']})
                  }
                }
              }}
            />
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexTableQHGFDT'}
              tableProps={{
                onRow: {
                  onChangeHandle: ({e, data, compId, index, dataIndex}) => {
                    this.updateSelect(e, compId, index);
                    this.setState({myActionName: [data.uuid + '-7-6',data.uuid + '-13-6']})
                  }
                }
              }}
            />
          </div>
        </div>
        <div className='bottomBox'>
          <div className='stockList'>
            <CompGenerater name={'ComplexTableZGQQ'}
              tableProps={{
                onRow: {
                  onChangeHandle: ({e, compId, data, index, dataIndex}) => {
                    let asset = window.codelist.data[data.uuid] && window.codelist.data[data.uuid].asset || undefined;
                    let dataType = asset === 4? '17': '6';
                    this.updateSelect(e, compId, index);
                    this.setState({myActionName: [data.uuid + '-7-' + dataType, data.uuid + '-13-' + dataType]})
                  }
                }
              }}
            />
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexChartFK'}  actionName={this.state.myActionName}/>
          </div>
          <div className='stockList'>
            <CompGenerater name={'ComplexNewsKC'} />
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react';
import FivePriceList from '../../../components/lists/FivePriceList';
import './index.less';
import CompGenerater from '@/components/modules/CompGenerater';



export default class OptionalStock extends Component{
    constructor(){
        super();
        this.state = {
            myActionName: '',
            myActionName2: 'SH.600999-5',
            choseAsset : '4'
        }
    }

  render() {
    let showFive = this.state.choseAsset === 0 || this.state.choseAsset === 5;
    return (
      <div className='optionalStock'>
        <div className='optionalTop'>
          <div className='stockList' style={{width: '100%', height: '100%'}}>
            <CompGenerater name={'OptionTableQHGZJQQ'}
              tableProps={{
                onRow: {
                  onChangeHandle: ({data, index, dataIndex}) => {
                    let asset = window.codelist.data[data.uuid] && window.codelist.data[data.uuid].asset || undefined;
                    let dataType = asset === 4? '17': '6';
                    this.setState({
                      myActionName: [ data.uuid + '-7-' + dataType,data.uuid + '-13-' + dataType],
                      myActionName2: data.uuid + '-5',
                      choseAsset: data.asset,
                    });
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="optionalBottom">
          <div className="flineChart" style={{width: showFive? '40%': '50%'}}>
            <div className="flineMain">
              <CompGenerater name={'OptionChartLeft'} actionName={this.state.myActionName[1]} showFive={showFive}/>
            </div>
          </div>
          <div  className={`fiveContent ${showFive ?'_block':'_none'}`}>
            <div className="fiveMain">
              <FivePriceList actionName={this.state.myActionName2} actionPage={'optionStock'}/>
            </div>
          </div>
          <div className="klineChartBox" style={{width: showFive? '40%': '50%'}}>
            <div className="klineMain">
              <CompGenerater name={'OptionChartRight'} actionName={this.state.myActionName[0]} showFive={showFive}/>
            </div>

          </div>
        </div>
      </div>

    );
  }
}

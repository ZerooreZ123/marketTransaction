import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { Icon, Input, AutoComplete } from 'antd';
const Option = AutoComplete.Option;
// const OptGroup = AutoComplete.OptGroup;

class StockSearch extends Component{
    constructor(){
        super();
        this.state = {
            //请求过的历史记录数据state
            dataSource:[
                {
                    name: '国投新集',
                    code: '000001',
                    stock: '沪深A',
                    selfStock:true
                },{
                    name: '天马',
                    code: '000002',
                    stock: '沪深A',
                    selfStock:true
                },{
                    name: '有多好',
                    code: '000003',
                    stock: '沪深A',
                    selfStock:true
                }, {
                    name: '是啥',
                    code: '000004',
                    stock: '沪深A',
                    selfStock:true
                },{
                    name: '设计语言',
                    code: '000005',
                    stock: '沪深A',
                    selfStock:true
                }
            ],
        }
    }
    //清空历史记录
    clearDataSource (){
        this.setState({
            dataSource:''
        })
    }
    //加减自选操作
    toSelfStock (code){
        var newData = this.state.dataSource.map((val)=>{
            if (val.code===code){
                console.log(val.selfStock)
                val.selfStock=!val.selfStock;
            }
            return val
        })
        this.setState({
            dataSource:newData
        })
    }
    renderOptions (){
        return [
            <Option disabled key="all" className="show-all">
                历史搜索记录
                <a onClick={this.clearDataSource.bind(this)}>清空</a>
            </Option>,
        ].concat(this.state.dataSource.map(group => (
            <Option key={group.code} value={`${group.name}  (${group.code})`}>
                {group.name}
                <span className="certain-search-item-count">{group.code}</span>
                <span className="certain-search-item-count">{group.stock}</span>
                <a onClick={(e)=>{e.stopPropagation();this.toSelfStock(group.code)}}>{group.selfStock?'-':'+'}</a>
            </Option>
        )))
    }
    render(){
        return (
            <div className="certain-category-search-wrapper">
                <AutoComplete
                    className="certain-category-search"
                    dropdownClassName="certain-category-search-dropdown"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 300 }}
                    dataSource={this.state.dataSource?this.renderOptions():''}
                    optionLabelProp="value"
                >
                    <Input placeholder="代码/简拼/全拼" suffix={<Icon type="search" className="certain-category-icon" />} />
                </AutoComplete>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect (mapStateToProps, mapDispatchToProps)(StockSearch);

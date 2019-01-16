import React, { Component } from 'react';

export default class ComF10Tabs extends Component{
    constructor(props){
        super(props)
        this.state={
            showIndex:0
        }
    }
    titleClick=(e)=>{
        this.setState({
            showIndex:e
        })
    }
    renderTitle=()=>{
        return this.props.tabsData.map((val,index)=>{
            return <div className={this.state.showIndex===index?'subCtrl active':'subCtrl'} onClick={()=>{this.titleClick(index)}}>
                {val.titleText}
            </div>
        })
    }
    renderComponents=()=>{
        return (
            <div className='tabContent'>
                {
                    this.props.tabsData.map((Val,index)=>{
                        return <div className={this.state.showIndex===index?'show':'hide'}>
                            {Val.component}
                        </div>
                    })
                }
            </div>
        )
    }
    render (){
        return (
            <div>
                <div className="tabMenu">
                    {this.renderTitle()}
                </div>
                <div className='tabContent'>
                    {this.renderComponents()}
                </div>
            </div>
        )
    }
}
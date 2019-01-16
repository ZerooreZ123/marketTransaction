import React, { Component } from 'react';
import { Spin, Alert } from 'antd';
import './LoadOrigin.less'
import loading from '@/resources/images/loading.gif'

class LoadOrigin extends Component{
    constructor(props){
        super(props);
        this.state = {
            result : '0',
        }
    }

    componentDidMount() {
        if(this.props.type ==='nomore'){
            this.setState({result : '1'})
        }else{
            setTimeout(() => {
                this.setState({result : '1'})
            }, 20000);
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.type !== nextProps.type){
            this.setState({result: '1'});
        }
    }

    render(){

        return (
            <div className="loadingSpin">
            {
                this.state.result === '0' && (
                  <div className='loadingcontent'>
                    <div className="column">
                      <div className="container animation-6">
                        <div className="shape shape1"></div>
                        <div className="shape shape2"></div>
                        <div className="shape shape3"></div>
                        <div className="shape shape4"></div>
                      </div>
                    </div>
                  </div>
                )
            }
            {
                this.state.result === '1' && (
                    <span style={{color:'#1890ff'}}>暂无数据</span>
                )
            }

            </div>
        )
    }
}
export default LoadOrigin;

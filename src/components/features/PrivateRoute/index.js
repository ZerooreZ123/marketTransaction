import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import Login from '../Login/index'
import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import * as Action from '../Test/actions';

//组件返回路由登录状态控制
class PrivateRoute extends Component{
    constructor(){
        super();
    }
    render(){
        return(
            <div>
                {this.props.isLogin==true?<Route {...this.props} />:<Login />}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    isLogin: state.login.isLogin
});

export default connect (mapStateToProps, {})(PrivateRoute);
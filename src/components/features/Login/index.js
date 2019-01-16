import React,{Component} from 'react';
import {Form,Input,Button} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Action from './actions';

class Login extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div className='login'>
                <h2>登录</h2>
                <p>暂时没有登录逻辑，直接点击登录模拟登录以解除简单权限控制</p>
                <Form>
                    <Input type='text'
                           placeholder='name'
                    />
                    <Input type='password'
                           placeholder='password'
                    />
                    <Button onClick={()=>{this.props.setLoginState(true)}}>
                        登录
                    </Button>
                </Form>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    isLogin: state.login.isLogin
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoginState:Action.setLoginState,
}, dispatch);

export default connect (mapStateToProps, mapDispatchToProps)(Login);

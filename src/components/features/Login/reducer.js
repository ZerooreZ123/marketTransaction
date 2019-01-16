import * as Action from './actionTypes.js';
//reducer例子，修改state必须使用Object.assign替换原来的state，否则是错误的
//这里的state初始化就是代表本reducer的状态，输出后直接在组件中可以通过connect高阶组件中的参数函数中访问
const initState = {
    isLogin: false
};

export default (state = initState, action) => {
    switch (action.type) {
        //提交登录状态到redux
        case Action.SET_LOGIN_STATE: {
            return Object.assign({}, state,{isLogin:action.val})
        }
        default:
            return state
    }
}

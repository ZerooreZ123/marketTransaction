import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { Provider } from 'react-redux';
import initStore from './utils/initStore';
import './resources/style/style.less'
//import 'animate.css'

// 创建 Redux 的 store 对象
const store = initStore();
window.store = store;
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);


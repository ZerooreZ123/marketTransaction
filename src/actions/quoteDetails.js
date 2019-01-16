import { createActions } from 'redux-actions';

export const {showAction,showToHide} = createActions({
    SHOW_ACTION: param => param,
    SHOW_TO_HIDE: param => {
    return new Promise((resolve) => {
        // 可以对参数进行处理
        setTimeout(() => {
            resolve(param)
        }, 300)
    })
}
});
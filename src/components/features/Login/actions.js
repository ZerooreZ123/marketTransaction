import * as ActionTypes from './actionTypes.js';
export const setLoginState = (val) => ({
    type: ActionTypes.SET_LOGIN_STATE,
    val:val
});
// export const submitLoginMessage = (msg) => ({
//     type: ActionTypes.SUBMIT_LOGIN_MESSAGE
//     msg:msg
// });
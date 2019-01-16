import { handleActions } from 'redux-actions';
import { login, logout, updatename } from '../actions/user';

const User = handleActions({
	[login]: (state, { payload }) => {
		localStorage.setItem('user', JSON.stringify(payload));
		return {
			...state,
			userInfo: payload
		}
		// Object.assign(state, {userInfo: payload})
	},
	[logout]: (state, { payload }) => {
		localStorage.removeItem('user');
		return {
			...state,
			userInfo: {}
		}
  },
  [updatename]: (state, { payload }) => {
    return {
      ...state,
      userInfo: payload.kk[0].body
    }
  }
}, {
  userInfo: 'ct'
})

export default User;

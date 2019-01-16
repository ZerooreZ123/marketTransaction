import { createActions } from 'redux-actions';
import { Resource } from '../utils/resource';

export const {login, logout, updatename,livelist,newslist} = createActions({
	LOGIN: param => param,
  LOGOUT: param => param,
  UPDATENAME: async param => {
    let kk = await Resource.testData.get();
    param.kk = kk;
    return param
  },
  LIVELIST: async param => {
    let kk = await Resource.livelist.get();
    param.kk = kk;
    return param
  },
  NEWSLIST: async param => {
    let kk = await Resource.newslist.get();
    param.kk = kk;
    return param
  },

});


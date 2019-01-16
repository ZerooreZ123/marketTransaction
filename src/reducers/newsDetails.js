import { handleActions } from 'redux-actions';
import { newsShowAction,newsShowToHide } from '../actions/newsDetails';

const NewsDetails = handleActions({
  [newsShowAction]: (state, {payload}) => {
    return {
      ...state,
      ...payload,
    }
  },
    [newsShowToHide]: (state, {payload}) => {
        return {
            ...state,
            ...payload,
        }
    }
}, {
  isShow:false,
  artiId: undefined
});
export default NewsDetails;


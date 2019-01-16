import { createActions } from 'redux-actions';

export const {newsShowAction,newsShowToHide} = createActions({
    NEWS_SHOW_ACTION: param => param,
    NEWS_SHOW_TO_HIDE:param => param,

});
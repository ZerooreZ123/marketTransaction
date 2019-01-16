import { combineReducers } from 'redux'
import User from './user';
import Data from './data';
import NewsDetails from './newsDetails';
import DisplayController from './displayController';

export default combineReducers({
  User,
  Data,
  NewsDetails,
  DisplayController,
});

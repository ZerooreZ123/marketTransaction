import { createActions } from 'redux-actions';

export const {controller, update, updateconfig} = createActions({
  CONTROLLER: param => param,
  UPDATE: param => param,
  UPDATECONFIG: param => param
});

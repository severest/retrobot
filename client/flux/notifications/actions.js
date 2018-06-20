import action$ from './stream.js';
import * as actionTypes from './action-types.js';

const actionDispatcher = (func) => (...args) =>
  action$.next(func(...args));

export const addNotification = actionDispatcher((payload) => ({
  type: actionTypes.addNotification,
  payload
}));
export const removeNotification = actionDispatcher((payload) => ({
  type: actionTypes.removeNotification,
  payload
}));

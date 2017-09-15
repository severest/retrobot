import action$ from './stream.js';

const actionDispatcher = (func) => (...args) =>
  action$.next(func(...args));

export const addPlus = actionDispatcher((payload) => ({
  type: 'ADD_PLUS',
  payload
}));
export const removePlus = actionDispatcher((payload) => ({
  type: 'REMOVE_PLUS',
  payload
}));

export const addDelta = actionDispatcher((payload) => ({
  type: 'ADD_DELTA',
  payload
}));
export const removeDelta = actionDispatcher((payload) => ({
  type: 'REMOVE_DELTA',
  payload
}));

export const updateVotes = actionDispatcher((payload) => ({
  type: 'UPDATE_VOTES',
  payload
}));

export const unhideAll = actionDispatcher(() => ({
  type: 'UNHIDE_ALL',
}));

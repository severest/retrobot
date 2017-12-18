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

export const updateOrder = actionDispatcher((payload) => ({
  type: 'UPDATE_ORDER',
  payload,
}));

export const updateTimer = actionDispatcher((payload) => ({
  type: 'UPDATE_TIMER',
  payload,
}));

export const sortDeltas = actionDispatcher(() => ({
  type: 'SORT_DELTAS',
}));

export const retroBoardInit = (retroKey) => {
  fetch(`/api/retro/${retroKey}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((res) => {
    return res.json();
  })
  .then((retro) => {
    retro.deltas.forEach((delta) => addDelta(delta));
    retro.pluses.forEach((plus) => addPlus(plus));
  });
};

export const createRetroError = actionDispatcher((payload) => ({
  type: 'CREATE_RETRO_ERROR',
  payload,
}));

import action$ from './stream.js';
import * as actionTypes from './action-types.js';

const actionDispatcher = (func) => (...args) =>
  action$.next(func(...args));

export const addPlus = actionDispatcher((payload) => ({
  type: actionTypes.addPlus,
  payload
}));
export const removePlus = actionDispatcher((payload) => ({
  type: actionTypes.removePlus,
  payload
}));

export const addDelta = actionDispatcher((payload) => ({
  type: actionTypes.addDelta,
  payload
}));
export const removeDelta = actionDispatcher((payload) => ({
  type: actionTypes.removeDelta,
  payload
}));

export const updateVotes = actionDispatcher((payload) => ({
  type: actionTypes.updateVotes,
  payload
}));

export const unhideAll = actionDispatcher(() => ({
  type: actionTypes.unhideAll,
}));

export const updateOrder = actionDispatcher((payload) => ({
  type: actionTypes.updateOrder,
  payload,
}));

export const updateTimer = actionDispatcher((payload) => ({
  type: actionTypes.updateTimer,
  payload,
}));

export const sortDeltas = actionDispatcher(() => ({
  type: actionTypes.sortDeltas,
}));

export const retroBoardInit = (retroKey, history) => {
  isLoading();
  fetch(`/api/retro/${retroKey}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((res) => {
    doneLoading();
    if (res.ok) {
      return res.json();
    } else if (res.status === 404) {
      history.push(`/notfound`);
    } else {
      throw new Error(`fetch error ${res.status}`);
    }
  })
  .then((retro) => {
    retro.deltas.forEach((delta) => addDelta(delta));
    retro.pluses.forEach((plus) => addPlus(plus));
  });
};

export const createRetroError = actionDispatcher((payload) => ({
  type: actionTypes.errorWhenCreatingRetro,
  payload,
}));

export const isLoading = actionDispatcher(() => ({
  type: actionTypes.loading,
}));
export const doneLoading = actionDispatcher(() => ({
  type: actionTypes.doneLoading,
}));

export const addUser = actionDispatcher((payload) => ({
  type: actionTypes.addUser,
  payload
}));
export const removeUser = actionDispatcher((payload) => ({
  type: actionTypes.removeUser,
  payload
}));

export const isOnline = actionDispatcher(() => ({
  type: actionTypes.updateOfflineStatus,
  payload: false,
}));
export const isOffline = actionDispatcher(() => ({
  type: actionTypes.updateOfflineStatus,
  payload: true,
}));

export const openNotesModal = actionDispatcher((payload) => ({
  type: actionTypes.openNotesModal,
  payload,
}));
export const closeNotesModal = actionDispatcher(() => ({
  type: actionTypes.closeNotesModal,
}));

export const updateDeltaNotes = actionDispatcher((payload) => ({
  type: actionTypes.updateDeltaNotes,
  payload,
}));

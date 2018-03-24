import action$ from './stream.js';
import * as actionTypes from './action-types.js';
import {
  sendNotesLock,
  sendNotesUnlock,
  sendNotes,
} from '../ws/index.js';

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

export const setRetroStatus = actionDispatcher((payload) => ({
  type: actionTypes.setRetroStatus,
  payload,
}));

export const setRetroCreator = actionDispatcher((payload) => ({
  type: actionTypes.setRetroCreator,
  payload,
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
    setRetroStatus(retro.status);
    setRetroCreator(retro.creator === window.myID);
    retro.deltas.sort((a,b) => b.votes - a.votes).forEach((delta) => {
      const parseDelta = {
        ...delta,
        content: decodeURIComponent(escape(atob(delta.content))),
      };
      addDelta(parseDelta);
    });
    retro.pluses.forEach((plus) => {
      const parsePlus = {
        ...plus,
        content: decodeURIComponent(escape(atob(plus.content))),
      };
      addPlus(parsePlus);
    });
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

export const openNotesModal = actionDispatcher((payload) => {
  sendNotesLock('delta');
  return {
    type: actionTypes.openNotesModal,
    payload,
  };
});
export const closeNotesModal = actionDispatcher(() => {
  sendNotesUnlock('delta');
  return {
    type: actionTypes.closeNotesModal,
  };
});

const debouncedSendNotes = _.debounce((payload) => {
  sendNotes('delta', payload.id, payload.notes);
}, 500);
export const updateDeltaNotes = actionDispatcher((payload) => {
  if (payload.fireRequest) {
    debouncedSendNotes(payload);
  }
  return {
    type: actionTypes.updateDeltaNotes,
    payload,
  };
});

export const lockNotes = actionDispatcher((payload) => ({
  type: actionTypes.lockNotes,
  payload,
}));
export const unlockNotes = actionDispatcher(() => ({
  type: actionTypes.unlockNotes,
}));

export const getTeamSummary = (team) => {
  isLoading();
  fetch(`/api/team/summary`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({team}),
  })
  .then((res) => {
    doneLoading();
    if (res.ok) {
      return res.json();
    } else {
      throw new Error();
    }
  })
  .then((team) => {
    receiveTeamSummary(team);
  })
  .catch(() => getTeamSummaryError());
};

export const getTeamSummaryError = actionDispatcher(() => ({
  type: actionTypes.getTeamSummaryError,
}));
export const receiveTeamSummary = actionDispatcher((payload) => ({
  type: actionTypes.receiveTeamSummary,
  payload,
}));

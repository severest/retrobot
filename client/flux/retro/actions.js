import _debounce from 'lodash/debounce';

import action$ from './stream.js';
import * as actionTypes from './action-types.js';
import {
  sendNotesLock,
  sendNotesUnlock,
  sendNotes,
} from '../../ws/index.js';

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
export const addPrevDelta = actionDispatcher((payload) => ({
  type: actionTypes.addPrevDelta,
  payload
}));
export const removeDelta = actionDispatcher((payload) => ({
  type: actionTypes.removeDelta,
  payload
}));

export const addDeltaToSelection = actionDispatcher((payload) => ({
  type: actionTypes.addDeltaToSelection,
  payload
}));
export const removeDeltaFromSelection = actionDispatcher((payload) => ({
  type: actionTypes.removeDeltaFromSelection,
  payload
}));
export const clearSelectedDeltas = actionDispatcher(() => ({
  type: actionTypes.clearSelectedDeltas
}));

export const updateVotes = actionDispatcher((payload) => ({
  type: actionTypes.updateVotes,
  payload
}));

export const unhideAll = actionDispatcher(() => ({
  type: actionTypes.unhideAll,
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

export const setTimeLimitMinutes = actionDispatcher((payload) => ({
  type: actionTypes.setTimeLimitMinutes,
  payload,
}));

export const setMaxVotes = actionDispatcher((payload) => ({
  type: actionTypes.setMaxVotes,
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
    setTimeLimitMinutes(retro.time_limit);
    setMaxVotes(retro.max_votes);
    setRetroCreator(retro.creator === window.myID);
    retro.deltas.sort((a,b) => b.votes.length - a.votes.length).forEach((delta) => {
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
    // only want previous deltas for this user with no notes
    retro.prev_deltas.filter(d => d.userId === window.myID && (!d.notes || d.notes === ''))
                     .forEach((delta) => {
      const parseDelta = {
        ...delta,
        content: decodeURIComponent(escape(atob(delta.content))),
      };
      addPrevDelta(parseDelta);
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

const debouncedSendNotes = _debounce((payload) => {
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
    return {
      ...team,
      retros: team.retros.map((retro) => ({
        ...retro,
        deltas: retro.deltas.map((d) => ({
          ...d,
          content: decodeURIComponent(escape(atob(d.content))),
        })),
      })),
    };
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

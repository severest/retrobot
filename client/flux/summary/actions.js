import action$ from './stream.js';
import * as actionTypes from './action-types.js';

const actionDispatcher = (func) => (...args) =>
  action$.next(func(...args));


export const isLoading = actionDispatcher(() => ({
  type: actionTypes.loading,
}));
export const doneLoading = actionDispatcher(() => ({
  type: actionTypes.doneLoading,
}));

export const getTeamSummary = (team, page=1) => {
  isLoading();
  fetch(`/api/team/summary`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      team,
      page,
    }),
  })
  .then((res) => {
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
    doneLoading();
  })
  .catch(() => {
    getTeamSummaryError();
    doneLoading();
  });
};

export const getTeamSummaryError = actionDispatcher(() => ({
  type: actionTypes.getTeamSummaryError,
}));
export const receiveTeamSummary = actionDispatcher((payload) => ({
  type: actionTypes.receiveTeamSummary,
  payload,
}));

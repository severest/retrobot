import action$ from './stream.js';
import * as actionTypes from './action-types.js';
import moment from 'moment';


const actionDispatcher = (func) => (...args) =>
  action$.next(func(...args));

export const isLoading = actionDispatcher(() => ({
  type: actionTypes.loading,
}));
export const doneLoading = actionDispatcher(() => ({
  type: actionTypes.doneLoading,
}));

export const getTeamSummary = (team) => {
  isLoading();
  Promise.all([
    getRetros(team),
    getTemperatureCheckSummary(team),
  ]).then(() => doneLoading());
};

export const getRetros = (team, page=1) => {
  return fetch(`/api/team/summary`, {
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
  })
  .catch(() => {
    getTeamSummaryError();
  });
};

export const defaultTemperaturCheckMonths = 12;
const defaultFrom = moment().subtract(defaultTemperaturCheckMonths, 'month').format('YYYY-MM-DD');
export const getTemperatureCheckSummary = (team, from=defaultFrom) => {
  return fetch(`/api/team/temperaturechecks`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      team,
      from,
    }),
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error();
    }
  })
  .then(({ temperatureChecks }) => {
    receiveTemperatureChecks(temperatureChecks);
  })
  .catch(() => {
    getTemperatureCheckSummaryError();
  });
};

export const getTeamSummaryError = actionDispatcher(() => ({
  type: actionTypes.getTeamSummaryError,
}));
export const receiveTeamSummary = actionDispatcher((payload) => ({
  type: actionTypes.receiveTeamSummary,
  payload,
}));

export const getTemperatureCheckSummaryError = actionDispatcher(() => ({
  type: actionTypes.getTemperatureCheckSummaryError,
}));
export const receiveTemperatureChecks = actionDispatcher((payload) => ({
  type: actionTypes.receiveTemperatureChecks,
  payload,
}));

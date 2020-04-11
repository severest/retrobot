import action$ from './stream.js';
import { scan, startWith } from 'rxjs/operators';

import * as actionTypes from './action-types.js';


// Initial State
export const initState = {
  getTeamSummaryError: '',
  getTemperatureCheckSummaryError: '',
  isLoading: false,
  teamSummary: {
    totalRetros: 0,
    retros: [],
    temperatureChecks: [],
  },
};

// Redux reducer
const actionMap = {
  [actionTypes.loading]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  [actionTypes.doneLoading]: (state) => {
    return {
      ...state,
      isLoading: false,
    };
  },
  [actionTypes.receiveTeamSummary]: (state, action) => {
    return {
      ...state,
      teamSummary: {
        ...state.teamSummary,
        ...action.payload,
        retros: state.teamSummary.retros.concat(action.payload.retros),
      },
    };
  },
  [actionTypes.getTeamSummaryError]: (state) => {
    return {
      ...state,
      getTeamSummaryError: 'No access to team',
    };
  },
  [actionTypes.receiveTemperatureChecks]: (state, action) => {
    return {
      ...state,
      teamSummary: {
        ...state.teamSummary,
        temperatureChecks: action.payload,
      },
    };
  },
  [actionTypes.getTemperatureCheckSummaryError]: (state) => {
    return {
      ...state,
      getTemperatureCheckSummaryError: 'No access to team',
    };
  },
};

export const reducer = (state = initState, action) => {
    const reduceFn = actionMap[action.type];
    if (reduceFn) {
        return reduceFn(state, action);
    }
    return state;
};

// Reduxification
export default action$.pipe(startWith(initState), scan(reducer));

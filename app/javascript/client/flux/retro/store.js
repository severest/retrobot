import _reverse from 'lodash/reverse';
import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';

import action$ from './stream.js';
import { scan, startWith } from 'rxjs/operators';

import * as actionTypes from './action-types.js';

import { RETRO_STATUS } from '../../utils/constants.js';


// Initial State
export const initState = {
  pluses: [],
  deltas: [],
  selectedDeltas: [],
  deltaGroups: [],
  deltaGroupDisplay: null,
  prevDeltas: [],
  myTemperatureCheck: null,
  temperatureChecks: [],
  timer: {
    show: false,
    minutes: 0,
    seconds: 0,
  },
  createRetroError: '',
  isLoading: false,
  users: [],
  isOffline: false,
  notes: null,
  notesLock: null,
  retroStatus: RETRO_STATUS.IN_PROGRESS,
  creator: false,
  timeLimitMinutes: 0,
  maxVotes: 0,
  includeTemperatureCheck: false,
  team: null,
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
  [actionTypes.addUser]: (state, action) => {
    return {
      ...state,
      users: state.users.concat(action.payload),
    };
  },
  [actionTypes.removeUser]: (state, action) => {
    return {
      ...state,
      users: state.users.filter(u => u !== action.payload),
      notesLock: state.notesLock === action.payload ? null : state.notesLock,
    };
  },
  [actionTypes.addPlus]: (state, action) => {
    const plus = action.payload;
    plus.order = state.pluses.length;
    plus.hide = plus.userId !== window.myID && state.retroStatus === RETRO_STATUS.IN_PROGRESS;
    return {
      ...state,
      pluses: state.pluses.concat(plus),
    };
  },
  [actionTypes.removePlus]: (state, action) => {
    return {
      ...state,
      pluses: state.pluses.filter(p => p.id !== action.payload.itemId),
    };
  },
  [actionTypes.addDelta]: (state, action) => {
    const delta = action.payload;
    delta.order = state.deltas.length;
    delta.hide = delta.userId !== window.myID && state.retroStatus === RETRO_STATUS.IN_PROGRESS;
    return {
      ...state,
      deltas: state.deltas.concat(delta),
    };
  },
  [actionTypes.addPrevDelta]: (state, action) => {
    const delta = action.payload;
    return {
      ...state,
      prevDeltas: state.prevDeltas.concat(delta),
    };
  },
  [actionTypes.removeDelta]: (state, action) => {
    return {
      ...state,
      deltas: state.deltas.filter(d => d.id !== action.payload.itemId),
      selectedDeltas: state.selectedDeltas.filter(d => d !== action.payload.itemId),
    };
  },
  [actionTypes.addDeltaToSelection]: (state, action) => {
    return {
      ...state,
      selectedDeltas: _uniq(state.selectedDeltas.concat(action.payload)),
    };
  },
  [actionTypes.removeDeltaFromSelection]: (state, action) => {
    return {
      ...state,
      selectedDeltas: state.selectedDeltas.filter(d => !action.payload.includes(d)),
    };
  },
  [actionTypes.clearSelectedDeltas]: (state) => {
    return {
      ...state,
      selectedDeltas: [],
    };
  },
  [actionTypes.updateDeltaGroups]: (state, action) => {
    return {
      ...state,
      deltaGroups: action.payload,
    };
  },
  [actionTypes.displayDeltaGroup]: (state, action) => {
    return {
      ...state,
      deltaGroupDisplay: action.payload,
    };
  },
  [actionTypes.clearDeltaGroupDisplay]: (state) => {
    return {
      ...state,
      deltaGroupDisplay: null,
    };
  },
  [actionTypes.updateVotes]: (state, action) => {
    return {
      ...state,
      deltas: state.deltas.map((d) => {
        if (d.id === action.payload.itemId && action.payload.itemType === 'delta') {
          return {
            ...d,
            votes: action.payload.votes,
          };
        }
        return d;
      }),
      pluses: state.pluses.map((d) => {
        if (d.id === action.payload.itemId && action.payload.itemType === 'plus') {
          return {
            ...d,
            votes: action.payload.votes,
          };
        }
        return d;
      }),
    };
  },
  [actionTypes.updateTimer]: (state, action) => {
    return {
      ...state,
      timer: {
        show: action.payload.minutes > 0 || action.payload.seconds > 0,
        minutes: action.payload.minutes,
        seconds: action.payload.seconds,
      }
    };
  },
  [actionTypes.unhideAll]: (state) => {
    return {
      ...state,
      deltas: state.deltas.map((d) => {
        return {
          ...d,
          hide: false,
        };
      }),
      pluses: state.pluses.map((p) => {
        return {
          ...p,
          hide: false,
        };
      }),
    };
  },
  [actionTypes.sortDeltas]: (state) => {
    return {
      ...state,
      deltas: _reverse(_sortBy(state.deltas, [(delta) => {
        const group = state.deltaGroups.find((g) => g.deltas.includes(delta.id));
        const votes = group ? group.deltas.reduce((arr, groupDeltaId) => {
          const groupDelta = state.deltas.find(del => del.id === groupDeltaId);
          if (groupDelta) {
            return arr.concat(groupDelta.votes);
          }
          return arr;
        }, []) : delta.votes;
        return votes.length;
      }, 'id'])),
    };
  },
  [actionTypes.errorWhenCreatingRetro]: (state, action) => {
    return {
      ...state,
      createRetroError: action.payload,
    };
  },
  [actionTypes.updateOfflineStatus]: (state, action) => {
    return {
      ...state,
      isOffline: action.payload,
    };
  },
  [actionTypes.openNotesModal]: (state, action) => {
    return {
      ...state,
      notes: action.payload,
    };
  },
  [actionTypes.closeNotesModal]: (state) => {
    return {
      ...state,
      notes: null,
    };
  },
  [actionTypes.updateDeltaNotes]: (state, action) => {
    const newDeltas = state.deltas.map((d) => {
      if (d.id === action.payload.id) {
        return {
          ...d,
          notes: action.payload.notes,
        };
      }
      return d;
    });
    return {
      ...state,
      deltas: newDeltas,
    };
  },
  [actionTypes.lockNotes]: (state, action) => {
    return {
      ...state,
      notesLock: action.payload,
    };
  },
  [actionTypes.unlockNotes]: (state) => {
    return {
      ...state,
      notesLock: null,
    };
  },
  [actionTypes.setRetroStatus]: (state, action) => {
    return {
      ...state,
      retroStatus: action.payload,
    };
  },
  [actionTypes.setRetroCreator]: (state, action) => {
    return {
      ...state,
      creator: action.payload,
    };
  },
  [actionTypes.setRetroTeam]: (state, action) => {
    return {
      ...state,
      team: action.payload,
    };
  },
  [actionTypes.setTimeLimitMinutes]: (state, action) => {
    return {
      ...state,
      timeLimitMinutes: action.payload,
    };
  },
  [actionTypes.setMaxVotes]: (state, action) => {
    return {
      ...state,
      maxVotes: action.payload,
    };
  },
  [actionTypes.setIncludeTemperatureCheck]: (state, action) => {
    return {
      ...state,
      includeTemperatureCheck: action.payload,
    };
  },
  [actionTypes.updateMyTemperatureCheck]: (state, action) => {
    return {
      ...state,
      myTemperatureCheck: action.payload,
    };
  },
  [actionTypes.addTemperatureCheck]: (state, action) => {
    let temperatureChecks;
    const temperatureCheck = action.payload;
    const existing = state.temperatureChecks.find(c => c.userId === temperatureCheck.userId);
    if (existing) {
      temperatureChecks = state.temperatureChecks.map((check) => {
        if (check.userId === temperatureCheck.userId) {
          return temperatureCheck;
        }
        return check;
      });
    } else {
      temperatureChecks = state.temperatureChecks.concat(temperatureCheck);
    }
    return {
      ...state,
      temperatureChecks,
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

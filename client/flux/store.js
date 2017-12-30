import action$ from './stream.js';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import '../utils/move-polyfill.js';

import * as actionTypes from './action-types.js';


// Initial State
export const initState = {
  pluses: [],
  deltas: [],
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
    };
  },
  [actionTypes.addPlus]: (state, action) => {
    const plus = action.payload;
    plus.order = state.pluses.length;
    return {
      ...state,
      pluses: state.pluses.concat(plus),
    };
  },
  [actionTypes.removePlus]: (state, action) => {
    return {
      ...state,
      pluses: state.pluses.reduce((arr, plus) => {
        if (plus.id === action.payload.itemId) {
          return arr;
        }
        return arr.concat(plus);
      }, []),
    };
  },
  [actionTypes.addDelta]: (state, action) => {
    const delta = action.payload;
    delta.order = state.deltas.length;
    return {
      ...state,
      deltas: state.deltas.concat(delta),
    };
  },
  [actionTypes.removeDelta]: (state, action) => {
    return {
      ...state,
      deltas: state.deltas.reduce((arr, delta) => {
        if (delta.id === action.payload.itemId) {
          return arr;
        }
        return arr.concat(delta);
      }, []),
    };
  },
  [actionTypes.updateOrder]: (state, action) => {
    if (action.payload.type === 'delta') {
      const deltas = state.deltas.move(action.payload.dragIndex, action.payload.hoverIndex);
      return {
        ...state,
        deltas,
      };
    }
    const pluses = state.pluses.move(action.payload.dragIndex, action.payload.hoverIndex);
    return {
      ...state,
      pluses,
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
      deltas: _.reverse(_.sortBy(state.deltas, ['votes', 'id'])),
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
};

export const reducer = (state = initState, action) => {
    const reduceFn = actionMap[action.type];
    if (reduceFn) {
        return reduceFn(state, action);
    }
    return state;
};

// Reduxification
export default action$.startWith(initState).scan(reducer);

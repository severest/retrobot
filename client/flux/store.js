import action$ from './stream.js';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';

// Initial State
const initState = {
  pluses: [],
  deltas: [],
  timer: {
    show: false,
    minutes: 0,
    seconds: 0,
  },
};

// Redux reducer
const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD_PLUS': {
      const plus = action.payload;
      plus.order = state.pluses.length;
      return {
        ...state,
        pluses: state.pluses.concat(plus),
      };
    }
    case 'REMOVE_PLUS':
      return {
        ...state,
        pluses: state.pluses.reduce((arr, plus) => {
          if (plus.id === action.payload.itemId) {
            return arr;
          }
          return arr.concat(plus);
        }, []),
      };
    case 'ADD_DELTA': {
      const delta = action.payload;
      delta.order = state.deltas.length;
      return {
        ...state,
        deltas: state.deltas.concat(delta),
      };
    }
    case 'REMOVE_DELTA':
      return {
        ...state,
        deltas: state.deltas.reduce((arr, delta) => {
          if (delta.id === action.payload.itemId) {
            return arr;
          }
          return arr.concat(delta);
        }, []),
      };
    case 'UPDATE_ORDER': {
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
    }
    case 'UPDATE_VOTES':
      return {
        ...state,
        deltas: state.deltas.map((d) => {
          if (d.id === action.payload.itemId) {
            return {
              ...d,
              votes: action.payload.votes,
            };
          }
          return d;
        }),
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: {
          show: action.payload.minutes > 0 || action.payload.seconds > 0,
          minutes: action.payload.minutes,
          seconds: action.payload.seconds,
        }
      };
    case 'UNHIDE_ALL':
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
    default:
      return state;
  }
}

// Reduxification
export default action$.startWith(initState).scan(reducer);

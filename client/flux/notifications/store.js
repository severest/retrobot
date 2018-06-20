import action$ from './stream.js';
import { scan, startWith } from 'rxjs/operators';

import * as actionTypes from './action-types.js';


// Initial State
export const initState = {
  notifications: [],
};

// Redux reducer
const actionMap = {
  [actionTypes.addNotification]: (state, action) => ({
    ...state,
    notifications: state.notifications.concat(action.payload),
  }),
  [actionTypes.removeNotification]: (state, action) => ({
    ...state,
    notifications: state.notifications.filter(n => n.key !== action.payload),
  }),
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

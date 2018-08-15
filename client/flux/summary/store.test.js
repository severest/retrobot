import * as actionTypes from './action-types.js';
import {
  initState,
  reducer,
} from './store.js';

describe('the store', () => {

  it('gives initial state', () => {
    expect(reducer(initState, {})).toEqual(initState);
  });

  it('receives summary', () => {
    let action = {
      type: actionTypes.receiveTeamSummary,
      payload: {
        retros: [
          { id: 1 },
        ],
        id: 1,
        name: 'team1',
      }
    };
    let newState = reducer(initState, action);
    action = {
      type: actionTypes.receiveTeamSummary,
      payload: {
        retros: [
          { id: 2 },
        ],
        id: 1,
        name: 'team1',
      }
    };
    newState = reducer(newState, action);
    expect(newState.teamSummary.retros.length).toBe(2);
  });

});

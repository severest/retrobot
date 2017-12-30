import * as actionTypes from './action-types.js';
import {
  initState,
  reducer,
} from './store.js';

describe('the store', () => {

  it('gives initial state', () => {
    expect(reducer(initState, {})).toEqual(initState);
  });

  it('loadings', () => {
    expect(initState.isLoading).toBe(false);
    let action = {
      type: actionTypes.loading,
    };
    let newState = reducer(initState, action);
    expect(newState.isLoading).toBe(true);
    action = {
      type: actionTypes.doneLoading,
    };
    newState = reducer(initState, action);
    expect(newState.isLoading).toBe(false);
  });

  it('stop loading', () => {
    expect(initState.isLoading).toBe(false);
    const action = {
      type: actionTypes.loading,
    };
    const newState = reducer(initState, action);
    expect(newState.isLoading).toBe(true);
  });

  it('adds pluses', () => {
    expect(initState.pluses.length).toBe(0);
    const action = {
      type: actionTypes.addPlus,
      payload: {id: 1},
    };
    const newState = reducer(initState, action);
    expect(newState.pluses.length).toBe(1);
  });

  it('removes pluses', () => {
    const init = {
      ...initState,
      pluses: [{id: 1}],
    };
    const action = {
      type: actionTypes.removePlus,
      payload: {itemId: 1},
    };
    const newState = reducer(init, action);
    expect(newState.pluses.length).toBe(0);
  });

  it('removes the right pluses', () => {
    const init = {
      ...initState,
      pluses: [{id: 1}, {id: 2}],
    };
    const action = {
      type: actionTypes.removePlus,
      payload: {itemId: 1},
    };
    const newState = reducer(init, action);
    expect(newState.pluses).toEqual([{id: 2}]);
  });

  it('doesnt do anything if asked to remove a plus that isnt there', () => {
    const init = {
      ...initState,
      pluses: [{id: 1}, {id: 2}],
    };
    const action = {
      type: actionTypes.removePlus,
      payload: {itemId: 3},
    };
    const newState = reducer(init, action);
    expect(newState.pluses).toEqual([{id: 1}, {id: 2}]);
  });

  it('adds deltas', () => {
    expect(initState.deltas.length).toBe(0);
    const action = {
      type: actionTypes.addDelta,
      payload: {id: 1},
    };
    const newState = reducer(initState, action);
    expect(newState.deltas.length).toBe(1);
  });

  it('removes deltas', () => {
    const init = {
      ...initState,
      deltas: [{id: 1}],
    };
    const action = {
      type: actionTypes.removeDelta,
      payload: {itemId: 1},
    };
    const newState = reducer(init, action);
    expect(newState.deltas.length).toBe(0);
  });

  it('removes the right deltas', () => {
    const init = {
      ...initState,
      deltas: [{id: 1}, {id: 2}],
    };
    const action = {
      type: actionTypes.removeDelta,
      payload: {itemId: 1},
    };
    const newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 2}]);
  });

  it('doesnt do anything if asked to remove a delta that isnt there', () => {
    const init = {
      ...initState,
      deltas: [{id: 1}, {id: 2}],
    };
    const action = {
      type: actionTypes.removeDelta,
      payload: {itemId: 3},
    };
    const newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 1}, {id: 2}]);
  });

  it('update votes on deltas', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, votes: 1}, {id: 2, votes: 2}],
      pluses: [{id: 1, votes: 3}, {id: 2, votes: 4}],
    };
    const action = {
      type: actionTypes.updateVotes,
      payload: {itemId: 1, votes: 5, itemType: 'delta'},
    };
    const newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 1, votes: 5}, {id: 2, votes: 2}]);
    expect(newState.pluses).toEqual([{id: 1, votes: 3}, {id: 2, votes: 4}]);
  });

  it('update votes on pluses', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, votes: 1}, {id: 2, votes: 2}],
      pluses: [{id: 1, votes: 3}, {id: 2, votes: 4}],
    };
    const action = {
      type: actionTypes.updateVotes,
      payload: {itemId: 1, votes: 5, itemType: 'plus'},
    };
    const newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 1, votes: 1}, {id: 2, votes: 2}]);
    expect(newState.pluses).toEqual([{id: 1, votes: 5}, {id: 2, votes: 4}]);
  });

  it('doesnt update votes', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, votes: 1}, {id: 2, votes: 2}],
      pluses: [{id: 1, votes: 3}, {id: 2, votes: 4}],
    };
    const action = {
      type: actionTypes.updateVotes,
      payload: {itemId: 10, votes: 5, itemType: 'delta'},
    };
    const newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 1, votes: 1}, {id: 2, votes: 2}]);
    expect(newState.pluses).toEqual([{id: 1, votes: 3}, {id: 2, votes: 4}]);
  });

  it('unhides all', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, hide: true}, {id: 2, hide: false}],
      pluses: [{id: 1, hide: true}, {id: 2, hide: true}],
    };
    const action = {
      type: actionTypes.unhideAll,
    };
    const newState = reducer(init, action);
    expect(newState.deltas.filter(d => d.hide).length).toBe(0);
    expect(newState.pluses.filter(p => p.hide).length).toBe(0);
  });

  it('adds users', () => {
    expect(initState.users.length).toBe(0);
    const action = {
      type: actionTypes.addUser,
      payload: '123',
    };
    const newState = reducer(initState, action);
    expect(newState.users.length).toBe(1);
  });

  it('removes users', () => {
    const init = {
      ...initState,
      users: ['123','456','1234'],
    };
    const action = {
      type: actionTypes.removeUser,
      payload: '123',
    };
    const newState = reducer(init, action);
    expect(newState.users.length).toBe(2);
  });

  it('removes notes lock when user leaves', () => {
    const init = {
      ...initState,
      users: ['123','456','1234'],
      notesLock: '123',
    };
    const action = {
      type: actionTypes.removeUser,
      payload: '123',
    };
    const newState = reducer(init, action);
    expect(newState.notesLock).toBe(null);
  });

  it('doesnt remove notes lock when diff user leaves', () => {
    const init = {
      ...initState,
      users: ['123','456','1234'],
      notesLock: '456',
    };
    const action = {
      type: actionTypes.removeUser,
      payload: '123',
    };
    const newState = reducer(init, action);
    expect(newState.notesLock).toBe('456');
  });

  it('updates order', () => {
    const init = {
      ...initState,
      deltas: [{id: 1}, {id: 2}, {id: 3}],
      pluses: [{id: 1}, {id: 2}, {id: 3}],
    };
    let action = {
      type: actionTypes.updateOrder,
      payload: {type: 'delta', dragIndex: 0, hoverIndex: 1},
    };
    let newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 2}, {id: 1}, {id: 3}]);
    expect(newState.pluses).toEqual([{id: 1}, {id: 2}, {id: 3}]);
    action = {
      type: actionTypes.updateOrder,
      payload: {type: 'plus', dragIndex: 0, hoverIndex: 2},
    };
    newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 2}, {id: 1}, {id: 3}]);
    expect(newState.pluses).toEqual([{id: 2}, {id: 3}, {id: 1}]);
  });

  it('updates timer', () => {
    const action = {
      type: actionTypes.updateTimer,
      payload: {minutes: 2, seconds: 43},
    };
    const newState = reducer(initState, action);
    expect(newState.timer.minutes).toBe(2);
    expect(newState.timer.seconds).toBe(43);
    expect(newState.timer.show).toBe(true);
  });

  it('hides timer', () => {
    let action = {
      type: actionTypes.updateTimer,
      payload: {minutes: 0, seconds: 1},
    };
    let newState = reducer(initState, action);
    expect(newState.timer.show).toBe(true);
    action = {
      type: actionTypes.updateTimer,
      payload: {minutes: 0, seconds: 0},
    };
    newState = reducer(initState, action);
    expect(newState.timer.show).toBe(false);
  });

  it('sorts deltas', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, votes: 4}, {id: 2, votes: 6}, {id: 3, votes: 6}],
    };
    let action = {
      type: actionTypes.sortDeltas,
    };
    let newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 3, votes: 6}, {id: 2, votes: 6}, {id: 1, votes: 4}]);
  });

  it('updates delta notes', () => {
    const init = {
      ...initState,
      deltas: [{id: 1, notes: ''}, {id: 2}, {id: 3, notes: 'hi there'}],
    };
    let action = {
      type: actionTypes.updateDeltaNotes,
      payload: {
        id: 1,
        notes: 'new notes there',
      },
    };
    let newState = reducer(init, action);
    expect(newState.deltas).toEqual([{id: 1, notes: 'new notes there'}, {id: 2}, {id: 3, notes: 'hi there'}]);
  });

  it('locks notes', () => {
    let action = {
      type: actionTypes.lockNotes,
      payload: 'jhonny',
    };
    let newState = reducer(initState, action);
    expect(newState.notesLock).toBe('jhonny');
  });

  it('unlocks notes', () => {
    const init = {
      ...initState,
      notesLock: 'hi',
    }
    let action = {
      type: actionTypes.unlockNotes,
    };
    let newState = reducer(init, action);
    expect(newState.notesLock).toBe(null);
  });

});

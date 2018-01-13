import ActionCable from 'actioncable';

import {
  addPlus,
  removePlus,
  addDelta,
  removeDelta,
  unhideAll,
  updateVotes,
  updateTimer,
  addUser,
  removeUser,
  lockNotes,
  unlockNotes,
  updateDeltaNotes,
} from '../flux/actions.js';

let retroChannel;
const cable = ActionCable.createConsumer();

export const connectToRetro = (room, receivedCallback) => {
  retroChannel = cable.subscriptions.create({ channel: "RetroChannel", room: room }, {
    connected: function() {
      this.perform('appear', {userId: window.myID});
    },
    received: (data) => {
      receivedCallback(data);
    },
  });
};

export const sendPlus = (content) => {
  retroChannel.send({ type: 'plus', content, userId: window.myID });
};

export const deletePlus = (id) => {
  retroChannel.send({ type: 'delete', itemType: 'plus', itemId: id });
};

export const sendDelta = (content) => {
  retroChannel.send({ type: 'delta', content, userId: window.myID });
};

export const deleteDelta = (id) => {
  retroChannel.send({ type: 'delete', itemType: 'delta', itemId: id });
};

export const sendTime = (minutes, seconds) => {
  retroChannel.send({ type: 'time', minutes, seconds });
};

export const sendUpVote = (itemType, itemId) => {
  retroChannel.send({ type: 'upvote', itemType, itemId });
};

export const sendDownVote = (itemType, itemId) => {
  retroChannel.send({ type: 'downvote', itemType, itemId });
};

export const sendNotesLock = (itemType) => {
  retroChannel.send({ type: 'noteslock', itemType, userId: window.myID });
};
export const sendNotesUnlock = (itemType) => {
  retroChannel.send({ type: 'notesunlock', itemType, userId: window.myID });
};

export const sendNotes = (itemType, itemId, notes) => {
  retroChannel.send({ type: 'notes', itemType, itemId, notes });
};

export default (room) => {
  connectToRetro(room, (data) => {
    data.hide = !(data.userId === window.myID || $('.timer:visible').length === 0);
    if (data.type === 'connect') {
      return addUser(data.userId);
    }
    if (data.type === 'disconnect') {
      return removeUser(data.userId);
    }
    if (data.type === 'plus') {
      return addPlus(data);
    }
    if (data.type === 'delta') {
      return addDelta(data);
    }
    if (data.type === 'time') {
      updateTimer({
        minutes: data.minutes,
        seconds: data.seconds,
      });
      if (data.minutes === 0 && data.seconds === 0) {
          unhideAll();
      }
      return;
    }

    if (data.type === 'upvote' || data.type === 'downvote') {
      return updateVotes(data);
    }
    if (data.type === 'delete' && data.itemType === 'delta') {
      return removeDelta(data);
    }
    if (data.type === 'delete' && data.itemType === 'plus') {
      return removePlus(data);
    }

    if (data.type === 'noteslock' && data.itemType === 'delta') {
      return lockNotes(data.userId);
    }
    if (data.type === 'notesunlock' && data.itemType === 'delta') {
      return unlockNotes();
    }
    if (data.type === 'notes' && data.itemType === 'delta') {
      return updateDeltaNotes({id: data.itemId, notes: data.notes});
    }
  });
}

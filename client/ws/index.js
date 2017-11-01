import ActionCable from 'actioncable';

import {
  addPlus,
  removePlus,
  addDelta,
  removeDelta,
  unhideAll,
  updateVotes,
  updateTimer,
} from '../flux/actions.js';

let retroChannel;
const cable = ActionCable.createConsumer();

export const connectToRetro = (room, receivedCallback) => {
  retroChannel = cable.subscriptions.create({ channel: "RetroChannel", room: room }, {
    received: (data) => {
      receivedCallback(data);
    },
  });
};

export const sendPlus = (content, userId) => {
  retroChannel.send({ type: 'plus', content: content, userId: userId });
};

export const deletePlus = (id) => {
  retroChannel.send({ type: 'delete', itemType: 'plus', itemId: id });
};

export const sendDelta = (content, userId) => {
  retroChannel.send({ type: 'delta', content: content, userId: userId });
};

export const deleteDelta = (id) => {
  retroChannel.send({ type: 'delete', itemType: 'delta', itemId: id });
};

export const sendTime = (minutes, seconds) => {
  retroChannel.send({ type: 'time', minutes: minutes, seconds: seconds });
};

export const sendUpVote = (itemType, itemId) => {
  retroChannel.send({ type: 'upvote', itemType: itemType, itemId: itemId });
};

export const sendDownVote = (itemType, itemId) => {
  retroChannel.send({ type: 'downvote', itemType: itemType, itemId: itemId });
};

export default (room) => {
  connectToRetro(room, (data) => {
    data.hide = !(data.userId === window.myID || $('.timer:visible').length === 0);
    if (data.type === 'plus') {
      addPlus(data);
    }
    if (data.type === 'delta') {
      addDelta(data);
    }
    if (data.type === 'time') {
      updateTimer({
        minutes: data.minutes,
        seconds: data.seconds,
      });
      if (data.minutes === 0 && data.seconds === 0) {
          unhideAll();
      }
    }

    if (data.type === 'upvote' || data.type === 'downvote') {
      updateVotes(data);
    }
    if (data.type === 'delete' && data.itemType === 'delta') {
      removeDelta(data);
    }
    if (data.type === 'delete' && data.itemType === 'plus') {
      removePlus(data);
    }
  });
}

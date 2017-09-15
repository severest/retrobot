// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//
//= require action_cable
//= require_self

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();
}).call(this);

WS = {
  connectToRetro: function(room, receivedCallback) {
    App.retroChannel = App.cable.subscriptions.create({ channel: "RetroChannel", room: room }, {
      received: function(data) {
        receivedCallback(data);
      },
    });
  },

  sendPlus: function(content, userId) {
    App.retroChannel.send({ type: 'plus', content: content, userId: userId });
  },

  deletePlus: function(id) {
    App.retroChannel.send({ type: 'delete', itemType: 'plus', itemId: id });
  },

  sendDelta: function(content, userId) {
    App.retroChannel.send({ type: 'delta', content: content, userId: userId });
  },

  deleteDelta: function(id) {
    App.retroChannel.send({ type: 'delete', itemType: 'delta', itemId: id });
  },

  sendTime: function(minutes, seconds, clock) {
    App.retroChannel.send({ type: 'time', minutes: minutes, seconds: seconds, clock: clock });
  },

  sendUpVote: function(itemType, itemId) {
    App.retroChannel.send({ type: 'upvote', itemType: itemType, itemId: itemId });
  },

  sendDownVote: function(itemType, itemId) {
    App.retroChannel.send({ type: 'downvote', itemType: itemType, itemId: itemId });
  },
};

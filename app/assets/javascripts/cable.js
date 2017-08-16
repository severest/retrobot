// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//
//= require action_cable
//= require_self

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();
}).call(this);

connectToRetro = function(room, receivedCallback) {
  App.retroChannel = App.cable.subscriptions.create({ channel: "RetroChannel", room: room }, {
    received: function(data) {
      receivedCallback(data);
    },
  });
};

sendPlus = function(content) {
  App.retroChannel.send({ type: 'plus', content: content });
};

sendDelta = function(content) {
  App.retroChannel.send({ type: 'delta', content: content });
};

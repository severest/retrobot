App.retroChannel = App.cable.subscriptions.create { channel: "RetroChannel", room: "Best Room" },
  received: (data) ->
    console.log data

App.retroChannel.send({ sent_by: "Hank", body: "This is a cool chat app." })

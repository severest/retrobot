class RetroChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_#{params[:room]}"
  end

  def receive(data)
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

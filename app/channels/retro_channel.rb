require "base64"
require "json"

class RetroChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_#{params[:room]}"
  end

  def unsubscribed
    self.broadcast({type: 'disconnect', userId: current_user.id})
  end

  def appear(data)
    current_user.id = data['userId']
    self.broadcast({type: 'connect', userId: current_user.id})
  end

  def receive(encodedData)
    data = JSON.parse(Base64.decode64(encodedData['data']))
    WebsocketHelper.handle(params[:room], data, lambda { |data| self.broadcast(data) }, lambda { |data| self.notification(data) })
  end

  protected

  def broadcast(data)
    ActionCable.server.broadcast("retro_#{params[:room]}", Base64.encode64(JSON.generate(data)))
  end

  def notification(data)
    ActionCable.server.broadcast("retro_notifications_#{params[:room]}_#{current_user.id}", data)
  end
end

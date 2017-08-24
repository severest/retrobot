class RetroChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_#{params[:room]}"
  end

  def receive(data)
    retro = Retro.find_by_key(params[:room])
    if data['type'] == 'plus'
      plus = Plus.create(retro: retro, content: data['content'])
      data['id'] = plus.id
    elsif data['type'] == 'delta'
      delta = Delta.create(retro: retro, content: data['content'])
      data['id'] = delta.id
    end
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

class RetroChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_#{params[:room]}"
  end

  def receive(data)
    puts '*********'
    puts data
    retro = Retro.find_by_key(params[:room])
    if data['type'] == 'plus'
      Plus.create(retro: retro, content: data['content'])
    elsif data['type'] == 'delta'
      Delta.create(retro: retro, content: data['content'])
    end
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

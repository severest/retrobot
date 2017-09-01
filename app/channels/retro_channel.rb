class RetroChannel < ApplicationCable::Channel
  def subscribed
    stream_from "retro_#{params[:room]}"
  end

  def receive(data)
    retro = Retro.find_by_key(params[:room])
    if data['type'] == 'plus'
      plus = Plus.create(retro: retro, content: data['content'])
      data['id'] = plus.id
      data['votes'] = 0
    elsif data['type'] == 'delta'
      delta = Delta.create(retro: retro, content: data['content'])
      data['id'] = delta.id
      data['votes'] = 0
    elsif data['type'] == 'upvote' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.votes = delta.votes + 1
      delta.save()
      data['votes'] = delta.votes
    elsif data['type'] == 'downvote' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.votes = delta.votes - 1
      delta.save()
      data['votes'] = delta.votes
    end
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

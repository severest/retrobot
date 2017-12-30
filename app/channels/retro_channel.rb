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

  def receive(data)
    retro = Retro.find_by_key(params[:room])
    if data['type'] == 'plus'
      plus = Plus.create(retro: retro, content: data['content'], user: data['userId'])
      data['id'] = plus.id
      data['votes'] = 0
    elsif data['type'] == 'delta'
      delta = Delta.create(retro: retro, content: data['content'], user: data['userId'])
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
    elsif data['type'] == 'notes' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.notes = data['notes']
      delta.save()
    elsif data['type'] == 'delete' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.destroy
    elsif data['type'] == 'delete' and data['itemType'] == 'plus'
      plus = Plus.find(data['itemId'])
      plus.destroy
    end
    self.broadcast(data)
  end

  protected

  def broadcast(data)
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

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

    if data['type'] == 'notes' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.notes = data['notes']
      delta.save
      self.broadcast(data)
    elsif data['type'] == 'time' and data['minutes'] == 0 and data['seconds'] == 0
      retro.status = :voting
      retro.save
      self.broadcast({'type' => 'status', 'status' => 'voting'})
    elsif data['type'] == 'lock'
      retro.status = :locked
      retro.save
      self.broadcast({'type' => 'status', 'status' => 'locked'})
    elsif data['type'] == 'unlock'
      retro.status = :voting
      retro.save
      self.broadcast({'type' => 'status', 'status' => 'voting'})
    elsif data['type'] == 'noteslock' or data['type'] == 'notesunlock'
      self.broadcast(data)
    end

    if !retro.locked?
      if data['type'] == 'upvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.votes = delta.votes + 1
        delta.save
        data['votes'] = delta.votes
        self.broadcast(data)
      elsif data['type'] == 'downvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.votes = delta.votes - 1
        delta.save
        data['votes'] = delta.votes
        self.broadcast(data)
      elsif data['type'] == 'plus'
        plus = Plus.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = plus.id
        data['votes'] = 0
        self.broadcast(data)
      elsif data['type'] == 'delta'
        delta = Delta.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = delta.id
        data['votes'] = 0
        self.broadcast(data)
      elsif data['type'] == 'delete' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.destroy
        self.broadcast(data)
      elsif data['type'] == 'delete' and data['itemType'] == 'plus'
        plus = Plus.find(data['itemId'])
        plus.destroy
        self.broadcast(data)
      end
    end

  end

  protected

  def broadcast(data)
    ActionCable.server.broadcast("retro_#{params[:room]}", data)
  end
end

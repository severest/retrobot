class WebsocketHelper
  def self.handle(retro_key, data, callback)
    retro = Retro.find_by_key(retro_key)

    if data['type'] == 'notes' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.notes = data['notes']
      delta.save
      callback.call(data)
    elsif data['type'] == 'time' and data['minutes'] == 0 and data['seconds'] == 0
      retro.status = :voting
      retro.save
      callback.call(data)
      callback.call({'type' => 'status', 'status' => 'voting'})
    elsif data['type'] == 'lock'
      retro.status = :locked
      retro.save
      callback.call({'type' => 'status', 'status' => 'locked'})
    elsif data['type'] == 'unlock'
      retro.status = :voting
      retro.save
      callback.call({'type' => 'status', 'status' => 'voting'})
    elsif ['noteslock', 'notesunlock', 'time'].include? data['type']
      callback.call(data)
    end

    if !retro.locked?
      if data['type'] == 'upvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.votes = delta.votes + 1
        delta.save
        data['votes'] = delta.votes
        callback.call(data)
      elsif data['type'] == 'downvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.votes = delta.votes - 1
        delta.save
        data['votes'] = delta.votes
        callback.call(data)
      elsif data['type'] == 'plus'
        plus = Plus.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = plus.id
        data['votes'] = 0
        callback.call(data)
      elsif data['type'] == 'delta'
        delta = Delta.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = delta.id
        data['votes'] = 0
        callback.call(data)
      elsif data['type'] == 'delete' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.destroy
        callback.call(data)
      elsif data['type'] == 'delete' and data['itemType'] == 'plus'
        plus = Plus.find(data['itemId'])
        plus.destroy
        callback.call(data)
      end
    end
  end
end

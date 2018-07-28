class WebsocketHelper
  def self.handle(retro_key, data, callback, notification_callback)
    retro = Retro.find_by_key(retro_key)

    if data['type'] == 'notes' and data['itemType'] == 'delta'
      delta = Delta.find(data['itemId'])
      delta.notes = data['notes']
      delta.save
      callback.call(data)
    elsif data['type'] == 'lock' and data['userId'] == retro.creator
      retro.status = :locked
      retro.save
      callback.call({'type' => 'status', 'status' => 'locked'})
    elsif data['type'] == 'unlock' and data['userId'] == retro.creator
      retro.status = :voting
      retro.save
      callback.call({'type' => 'status', 'status' => 'voting'})
    elsif data['type'] == 'time' and data['userId'] == retro.creator
      callback.call(data)
      if data['minutes'] == 0 and data['seconds'] == 0
        retro.status = :voting
        retro.save
        callback.call({'type' => 'status', 'status' => 'voting'})
      end
    elsif ['noteslock', 'notesunlock'].include? data['type']
      callback.call(data)
    elsif data['type'] == 'group' and data['itemType'] == 'delta' and data['userId'] == retro.creator
      DeltaGroup.joins(delta_group_items: :delta).where('deltas.id' => data['deltas']).destroy_all
      dg = DeltaGroup.create(retro: retro)
      dg.add_deltas(data['deltas'])
      callback.call({
          'type' => 'deltaGroups',
          'groups' => retro.delta_group_array
      })
    elsif data['type'] == 'delete' and data['itemType'] == 'deltaGroup' and data['userId'] == retro.creator
      DeltaGroup.find(data['deltaGroupId']).destroy
      callback.call({
          'type' => 'deltaGroups',
          'groups' => retro.delta_group_array
      })
    elsif data['type'] == 'delete' and data['itemType'] == 'deltaGroupItem' and data['userId'] == retro.creator
      DeltaGroupItem.joins(:delta).where('deltas.id' => data['deltaId']).destroy_all
      callback.call({
          'type' => 'deltaGroups',
          'groups' => retro.delta_group_array
      })
    end

    if !retro.locked?
      if data['type'] == 'upvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        if DeltaVote.joins(delta: :retro).select('retros.key').where(user: data['userId'], 'retros.key' => retro.key).size < retro.max_votes
          DeltaVote.create(user: data['userId'], delta: delta)
          data['votes'] = delta.delta_votes.pluck(:user)
          callback.call(data)
        else
          notification_callback.call({'error' => 'You\'ve already voted the maximum number of times'})
        end
      elsif data['type'] == 'downvote' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        vote = DeltaVote.where(user: data['userId'], delta: delta).first()
        if !vote.nil?
          vote.destroy
          data['votes'] = delta.delta_votes.pluck(:user)
          callback.call(data)
        else
          notification_callback.call({'error' => 'You can\'t downvote something you haven\'t voted for'})
        end
      elsif data['type'] == 'plus'
        plus = Plus.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = plus.id
        data['votes'] = []
        callback.call(data)
      elsif data['type'] == 'delta'
        delta = Delta.create(retro: retro, content: data['content'], user: data['userId'])
        data['id'] = delta.id
        data['votes'] = []
        callback.call(data)
      elsif data['type'] == 'delete' and data['itemType'] == 'delta'
        delta = Delta.find(data['itemId'])
        delta.destroy
        callback.call(data)
        callback.call({
            'type' => 'deltaGroups',
            'groups' => retro.delta_group_array
        })
      elsif data['type'] == 'delete' and data['itemType'] == 'plus'
        plus = Plus.find(data['itemId'])
        plus.destroy
        callback.call(data)
      end
    end
  end
end

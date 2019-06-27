class WebsocketHelper
  def self.handle(retro_key, data, callback, notification_callback)
    retro = Retro.find_by_key(retro_key)

    if data['type'] == 'notes' and data['itemType'] == 'deltaGroup'
      delta_group = DeltaGroup.find(data['itemId'])
      delta_group.notes = data['notes']
      delta_group.save
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
    elsif data['type'] == 'merge' and data['itemType'] == 'deltaGroup' and data['userId'] == retro.creator
      merge_group = DeltaGroup.find(data['deltaGroups'][0])
      merge_group.update(notes: DeltaGroup.where('id': data['deltaGroups']).where.not(notes: nil).pluck('notes').join('/n/n'))
      DeltaGroupVote.where(delta_group_id: data['deltaGroups']).update_all(delta_group_id: data['deltaGroup'][0])
      callback.call(WebsocketHelper.render_delta_groups(retro))
    elsif data['type'] == 'delete' and data['itemType'] == 'deltaGroupItem' and data['userId'] == retro.creator
      DeltaGroupItem.where('delta_id' => data['deltaId']).destroy_all
      new_group = DeltaGroup.create(retro: retro)
      new_group.add_deltas([data['deltaId']])
      callback.call(WebsocketHelper.render_delta_groups(retro))
    end

    if !retro.locked?
      if data['type'] == 'upvote' and data['itemType'] == 'deltaGroup'
        group = DeltaGroup.find(data['itemId'])
        if DeltaGroupVote.joins(delta_group: :retro).select('retros.key').where(user: data['userId'], 'retros.key' => retro.key).size < retro.max_votes
          DeltaGroupVote.create(user: data['userId'], delta_group: group)
          data['votes'] = group.delta_group_votes.pluck(:user)
          callback.call(data)
        else
          notification_callback.call({'error' => 'You\'ve already voted the maximum number of times'})
        end
      elsif data['type'] == 'downvote' and data['itemType'] == 'deltaGroup'
        group = DeltaGroup.find(data['itemId'])
        vote = DeltaGroupVote.where(user: data['userId'], delta_group: group).first()
        if !vote.nil?
          vote.destroy
          data['votes'] = group.delta_group_votes.pluck(:user)
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
        group = DeltaGroup.create(retro: retro)
        delta = Delta.create(retro: retro, content: data['content'], user: data['userId'])
        group.add_deltas([delta.id])
        data['id'] = delta.id
        data['votes'] = []
        callback.call(WebsocketHelper.render_delta_groups(retro))
      elsif data['type'] == 'delete' and data['itemType'] == 'deltaGroup'
        DeltaGroup.find(data['itemId']).destroy
        callback.call(WebsocketHelper.render_delta_groups(retro))
      elsif data['type'] == 'delete' and data['itemType'] == 'plus'
        plus = Plus.find(data['itemId'])
        plus.destroy
        callback.call(data)
      elsif data['type'] == 'temperature'
        temperature_check = TemperatureCheck.where(retro: retro, user: data['userId']).first
        if temperature_check.nil?
          if TemperatureCheck.create(retro: retro, user: data['userId'], temperature: data['temperature'], notes: data['notes']).id.nil?
            notification_callback.call({'error' => 'Unable to create new temperature check'})
          else
            callback.call(data)
          end
        else
          temperature_check.temperature = data['temperature']
          temperature_check.notes = data['notes']
          if !temperature_check.save
            notification_callback.call({'error' => 'Unable to update temperature check'})
          else
            callback.call(data)
          end
        end
      end
    end
  end

  def self.render_delta_groups(retro)
    obj = ApplicationController.render(partial: 'retro/delta_groups.json.jbuilder', locals: { retro: retro })
    obj['type'] = 'deltaGroups'
    return obj
  end
end

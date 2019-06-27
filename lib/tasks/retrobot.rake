namespace :retrobot do

  desc "Move votes from delta model to their own (OUTDATED)"
  task migrate_votes: :environment do
    Delta.find_each do |delta|
      if delta.votes > 0
        DeltaVote.where(delta: delta).destroy_all
        (1..delta.votes).each do |vote|
          DeltaVote.create(delta: delta)
        end
      end
    end
  end

  desc "Move individual deltas into a group of one"
  task migrate_deltas_to_group: :environment do
    deltas_in_groups = DeltaGroup.joins(:delta_group_items).pluck('delta_group_items.delta_id')
    Delta.where.not(id: deltas_in_groups).find_each do |delta|
      dg = DeltaGroup.create(retro: delta.retro)
      dg.add_deltas([delta.id])
    end
    puts "DONE"
  end

  desc "Move delta notes to group (must be run after migrate_deltas_to_group)"
  task migrate_notes_to_delta_group: :environment do
    DeltaGroup.find_each do |delta_group|
      notes = delta_group.deltas.where.not(:notes => nil).pluck('notes').join('\n\n')
      if notes != ""
        delta_group.notes = notes
        delta_group.save!
      end
    end
    puts "DONE"
  end

  desc "Move delta votes to group (must be run after migrate_notes_to_delta_group)"
  task migrate_votes_to_delta_group: :environment do
    DeltaVote.find_each do |vote|
      g = DeltaGroup.joins(:deltas).where('deltas.id': vote.delta.id).first
      DeltaGroupVote.create(delta_group: g, user: vote.user)
    end
    puts "DONE"
  end

end

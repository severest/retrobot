namespace :retrobot do

  desc "Move votes from delta model to their own"
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

end

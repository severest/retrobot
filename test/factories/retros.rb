FactoryBot.define do
  factory :retro do
    status { "in_progress" }
    key { SecureRandom.hex(3) }
  end

  factory :full_retro, parent: :retro do
    transient do
      delta_count { 5 }
      pluses_count { 5 }
    end

    after(:create) do |retro, evaluator|
      deltas = create_list(:delta, evaluator.delta_count, retro: retro)
      deltas.each do |d|
        g = create(:delta_group, retro: retro)
        g.add_deltas([d.id])
      end
      create_list(:plus, evaluator.pluses_count, retro: retro)
    end
  end
end

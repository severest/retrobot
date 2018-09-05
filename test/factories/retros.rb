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
      create_list(:delta, evaluator.delta_count, retro: retro)
      create_list(:plus, evaluator.pluses_count, retro: retro)
    end
  end
end

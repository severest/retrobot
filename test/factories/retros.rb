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

  factory :retro_with_temp_check, parent: :retro do
    transient do
      user_id { '2' }
      temperature { 5 }
      notes { 'hi' }
    end

    after(:create) do |retro, evaluator|
      create(:temperature_check, retro: retro, temperature: evaluator.temperature, notes: evaluator.notes, user: evaluator.user_id)
    end
  end
end

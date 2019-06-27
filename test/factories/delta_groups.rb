FactoryBot.define do
  factory :delta_group do
  end

  factory :delta_group_one_delta, parent: :delta_group do
    after(:create) do |group, evaluator|
      delta = create(:delta, retro: group.retro)
      group.add_deltas([delta.id])
    end
  end
end

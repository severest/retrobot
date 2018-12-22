FactoryBot.define do
  factory :temperature_check do
    retro
    temperature { 1 }
    notes { "" }
  end
end

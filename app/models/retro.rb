class Retro < ApplicationRecord
  has_many :pluses, class_name: 'Plus'
  has_many :deltas, class_name: 'Delta'
end

class Retro < ApplicationRecord
  has_many :pluses, class_name: 'Plus'
  has_many :deltas, class_name: 'Delta'

  validates :key, format: { with: /\A[a-zA-Z0-9]{6}\z/,
    message: "6 digit alphanumeric" }
end

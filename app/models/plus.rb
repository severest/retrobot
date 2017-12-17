class Plus < ApplicationRecord
  self.table_name = "pluses"
  belongs_to :retro

  validates :retro, presence: true
end

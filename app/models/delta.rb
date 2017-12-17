class Delta < ApplicationRecord
  self.table_name = "deltas"
  belongs_to :retro

  validates :retro, presence: true
end

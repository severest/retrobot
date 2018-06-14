class Delta < ApplicationRecord
  self.table_name = "deltas"
  belongs_to :retro
  has_many :delta_votes

  validates :retro, presence: true
end

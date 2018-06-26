class Delta < ApplicationRecord
  self.table_name = "deltas"
  belongs_to :retro
  has_many :delta_votes, dependent: :destroy
  has_one :delta_group_item, dependent: :destroy

  validates :retro, presence: true
end

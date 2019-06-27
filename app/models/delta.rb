class Delta < ApplicationRecord
  self.table_name = "deltas"
  belongs_to :retro
  has_one :delta_group_item, dependent: :destroy
  has_one :delta_group, through: :delta_group_item

  validates :retro, presence: true
end

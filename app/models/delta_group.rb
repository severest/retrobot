class DeltaGroup < ApplicationRecord
  belongs_to :retro
  has_many :delta_group_items, dependent: :destroy
  has_many :deltas, through: :delta_group_items

  def add_deltas(deltas)
    deltas.each do |d|
      DeltaGroupItem.create(delta_group: self, delta_id: d)
    end
  end
end

class Delta < ApplicationRecord
  self.table_name = "deltas"
  belongs_to :retro
end

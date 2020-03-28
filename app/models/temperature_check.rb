class TemperatureCheck < ApplicationRecord
  belongs_to :retro

  validates :retro, :temperature, presence: true
  validates :temperature, numericality: {
    greater_than_or_equal_to: 0, less_than_or_equal_to: 10
  }
end

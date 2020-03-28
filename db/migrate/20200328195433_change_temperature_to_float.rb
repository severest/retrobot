class ChangeTemperatureToFloat < ActiveRecord::Migration[5.2]
  def change
    change_table :temperature_checks do |t|
      t.change :temperature, :float
    end
  end
end

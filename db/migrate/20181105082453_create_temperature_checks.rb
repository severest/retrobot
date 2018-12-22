class CreateTemperatureChecks < ActiveRecord::Migration[5.2]
  def change
    create_table :temperature_checks do |t|
      t.references :retro
      t.integer :temperature
      t.text :notes
      t.string :user

      t.timestamps
    end
  end
end

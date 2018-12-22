class AddIncludeTempCheckToRetros < ActiveRecord::Migration[5.2]
  def change
    add_column :retros, :include_temperature_check, :boolean, default: false
  end
end

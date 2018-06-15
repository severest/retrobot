class AddTimeLimitMinutesToRetros < ActiveRecord::Migration[5.2]
  def change
    add_column :retros, :time_limit_minutes, :integer, default: 5
  end
end

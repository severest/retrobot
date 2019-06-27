class AddNotesToDeltaGroup < ActiveRecord::Migration[5.2]
  def change
    add_column :delta_groups, :notes, :text
  end
end

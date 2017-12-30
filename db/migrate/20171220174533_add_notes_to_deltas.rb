class AddNotesToDeltas < ActiveRecord::Migration[5.1]
  def change
    add_column :deltas, :notes, :text
  end
end

class AddUserToDeltas < ActiveRecord::Migration[5.1]
  def change
    add_column :deltas, :user, :string
  end
end

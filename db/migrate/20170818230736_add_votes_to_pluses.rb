class AddVotesToPluses < ActiveRecord::Migration[5.1]
  def change
    add_column :pluses, :votes, :integer, default: 0
  end
end

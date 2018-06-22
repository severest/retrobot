class RemoveVotesFromDeltas < ActiveRecord::Migration[5.2]
  def change
    remove_column :deltas, :votes, :integer
  end
end

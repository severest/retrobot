class RemoveVotesFromPluses < ActiveRecord::Migration[5.2]
  def change
    remove_column :pluses, :votes, :number
  end
end

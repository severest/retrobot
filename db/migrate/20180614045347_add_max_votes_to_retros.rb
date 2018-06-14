class AddMaxVotesToRetros < ActiveRecord::Migration[5.2]
  def change
    add_column :retros, :max_votes, :integer, default: 2
  end
end

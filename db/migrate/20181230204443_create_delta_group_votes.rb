class CreateDeltaGroupVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :delta_group_votes do |t|
      t.string :user
      t.bigint :delta_group_id, index: true

      t.timestamps
    end
    add_foreign_key :delta_group_votes, :delta_groups, column: :delta_group_id
  end
end

class CreateDeltaVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :delta_votes do |t|
      t.string :user
      t.bigint :delta_id, index: true

      t.timestamps
    end
    add_foreign_key :delta_votes, :deltas, column: :delta_id
  end
end

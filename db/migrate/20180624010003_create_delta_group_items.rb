class CreateDeltaGroupItems < ActiveRecord::Migration[5.2]
  def change
    create_table :delta_group_items do |t|
      t.references :delta_group, foreign_key: true
      t.bigint :delta_id, index: true

      t.timestamps
    end
    add_foreign_key :delta_group_items, :deltas, column: :delta_id
    add_index :delta_group_items, :delta_id, unique: true, name: 'delta_group_items_unique_delta_id'
  end
end

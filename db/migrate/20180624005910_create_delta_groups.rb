class CreateDeltaGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :delta_groups do |t|
      t.references :retro, foreign_key: true

      t.timestamps
    end
  end
end

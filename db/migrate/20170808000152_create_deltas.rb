class CreateDeltas < ActiveRecord::Migration[5.1]
  def change
    create_table :deltas do |t|
      t.text :content
      t.references :retro, foreign_key: true

      t.timestamps
    end
  end
end

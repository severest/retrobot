class CreateRetros < ActiveRecord::Migration[5.1]
  def change
    create_table :retros do |t|
      t.string :key, limit: 191

      t.timestamps
    end
    add_index :retros, :key, unique: true
  end
end

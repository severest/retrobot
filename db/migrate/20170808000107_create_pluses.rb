class CreatePluses < ActiveRecord::Migration[5.1]
  def change
    create_table :pluses do |t|
      t.text :content
      t.references :retro, foreign_key: true

      t.timestamps
    end
  end
end

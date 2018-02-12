class AddCreatorToRetro < ActiveRecord::Migration[5.1]
  def change
    add_column :retros, :creator, :string
  end
end

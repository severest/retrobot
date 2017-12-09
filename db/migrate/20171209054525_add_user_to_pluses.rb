class AddUserToPluses < ActiveRecord::Migration[5.1]
  def change
    add_column :pluses, :user, :string
  end
end

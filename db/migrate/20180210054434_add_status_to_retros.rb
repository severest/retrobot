class AddStatusToRetros < ActiveRecord::Migration[5.1]
  def change
    add_column :retros, :status, :integer, default: 2
  end
end

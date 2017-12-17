class AddTeamsToRetros < ActiveRecord::Migration[5.1]
  def change
    add_reference :retros, :team, foreign_key: true
  end
end

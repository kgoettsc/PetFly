class RemoveRescueType < ActiveRecord::Migration[6.0]
  def change
    remove_column :animals, :type
  end
end

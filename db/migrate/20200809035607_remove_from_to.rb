class RemoveFromTo < ActiveRecord::Migration[6.0]
  def change
    remove_column :rescues, :from_id
    remove_column :rescues, :to_id
    remove_column :rescues, :from_airports
    remove_column :rescues, :to_airports
  end
end

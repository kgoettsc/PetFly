class AddRescueStatus < ActiveRecord::Migration[6.0]
  def change
    add_column :rescues, :status, :string

    add_column :animals, :kind, :string
    add_column :animals, :breed, :string
  end
end

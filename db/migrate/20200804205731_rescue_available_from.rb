class RescueAvailableFrom < ActiveRecord::Migration[6.0]
  def change
    add_column :rescues, :available_from, :date, index: true
  end
end

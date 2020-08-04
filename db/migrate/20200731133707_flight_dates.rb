class FlightDates < ActiveRecord::Migration[6.0]
  def change
    add_column :flights, :departing_at, :datetime, null: false
    add_column :flights, :arriving_at, :datetime, null: false
    add_column :flights, :archived_at, :datetime

    add_reference :flights, :departing_airport, index: true
    add_reference :flights, :arriving_airport, index: true
  end
end

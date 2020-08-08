class RequestFlightsMatches < ActiveRecord::Migration[6.0]
  def change
    add_reference :rescue_flights, :rescue_approver, index: true
    add_reference :rescue_flights, :flight_approver, index: true

    add_column :rescue_flights, :status, :string
    add_column :rescue_flights, :requested_at, :datetime
    add_column :rescue_flights, :approved_at, :datetime
    add_column :rescue_flights, :cancelled_at, :datetime
  end
end

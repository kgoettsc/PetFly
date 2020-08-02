class FlightsController < ApplicationController

  def index
    flights = current_user.flights.pending

    render json: {flights: JsonService.flights(flights)}
  end

  def show

  end

  def create
    departing_airport = Airport.find_by(uuid: params[:departing_airport_uuid])
    arriving_airport = Airport.find_by(uuid: params[:arriving_airport_uuid])

    flight = Flight.create!(
      user: current_user,
      number: flight_params[:number],
      can_transport: flight_params[:can_transport],
      departing_at: flight_params[:departing_date],
      arriving_at: flight_params[:arriving_date],
      departing_airport: departing_airport,
      arriving_airport: arriving_airport
    )

    render json: {flight: JsonService.flight(flight)}
  end

  def update

  end

  def delete

  end

  def search_by_number
    searched_flights = FlightAwareService.get_flight_info(params[:id])

    render json: {flights: searched_flights}
  end

  def flight_params
    params.permit(:number, :can_transport, :departing_date, :arriving_date, :departing_airport_uuid, :arriving_airport_uuid)
  end
end
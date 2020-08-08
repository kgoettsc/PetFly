class FlightsController < ApplicationController

  def index
    flights = current_user.flights.pending

    render json: {flights: JsonService.flights(flights)}
  end

  def show
    flight = Flight.find_by(uuid: params[:id])

    render json: {flight: JsonService.flight(flight)}
  end

  def create
    departing_airport = Airport.find_by(uuid: params[:departing_airport_uuid])
    arriving_airport = Airport.find_by(uuid: params[:arriving_airport_uuid])

    flight = Flight.create!(
      user: current_user,
      number: flight_params[:number],
      can_transport: flight_params[:can_transport],
      departing_at: flight_params[:departing_at],
      arriving_at: flight_params[:arriving_at],
      departing_airport: departing_airport,
      arriving_airport: arriving_airport
    )

    render json: {flight: JsonService.flight(flight)}
  end

  def update
    flight = Flight.find_by(uuid: params[:id])

    departing_airport = Airport.find_by(uuid: params[:departing_airport_uuid])
    arriving_airport = Airport.find_by(uuid: params[:arriving_airport_uuid])

    flight.update!(
      number: flight_params[:number],
      can_transport: flight_params[:can_transport],
      departing_at: flight_params[:departing_at],
      arriving_at: flight_params[:arriving_at],
      departing_airport: departing_airport,
      arriving_airport: arriving_airport
    )

    render json: {flight: JsonService.flight(flight)}
  end

  def delete
    flight = Flight.find_by(uuid: params[:id])

    flight.archive!

    render json: {flight: JsonService.flight(flight)}
  end

  def search_by_number
    searched_flights = FlightAwareService.get_flight_info(params[:id])

    render json: {flights: searched_flights}
  end

  def active_by_user
    flights = Flight.active
                    .where(user: current_user)
                    .order(:created_at)
                    .limit(50)

    render json: {flights: JsonService.flights(flights)}
  end

  def matches
    flight = Flight.find_by(uuid: params[:id])

    matches = MatchService.flight_matches(flight)

    render json: {matches: JsonService.rescues(matches)}
  end

  def request_match
    flight = Flight.find_by(uuid: params[:id])

    _rescue = Rescue.find_by(uuid: params[:rescue_uuid])

    rescue_flight = RescueFlight.active.find_or_create_by(flight: flight, rescue: _rescue)
    rescue_flight.rescue_approver = current_user
    rescue_flight.save!

    render json: {rescue_flight: JsonService.rescue_flight(rescue_flight)}
  end

  def flight_params
    params.permit(:number, :can_transport, :departing_at, :arriving_at, :departing_airport_uuid, :arriving_airport_uuid)
  end
end
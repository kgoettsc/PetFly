class RescueFlightsController < ApplicationController

  def show

  end

  def by_rescue_and_flights
    _rescue = Rescue.find_by(uuid: flight_rescue_params[:rescue_uuid])
    flights = Flight.where(uuid: flight_rescue_params[:flight_uuids])

    rescue_flights = RescueFlight.where(rescue: _rescue, flight: flights)

    render json: {rescue_flights: JsonService.rescue_flights(rescue_flights)}
  end

  def by_flight_and_rescues
    flight = Flight.find_By(uuid: flight_rescue_params[:flight_uuid])
    _rescues = Rescue.where(uuid: flight_rescue_params[:rescue_uuids])

    rescue_flights = RescueFlight.where(rescue: _rescue, flight: flights)

    render json: {rescue_flights: JsonService.rescue_flights(rescue_flights)}
  end

  def create_as_rescue
    _rescue = Rescue.find_by(uuid: flight_rescue_params[:rescue_uuid])
    flights = Flight.find_by(uuid: flight_rescue_params[:flight_uuid])

    rescue_flight = RescueFlight.find_or_create_by(
                      rescue: _rescue,
                      flight: flights
                    )

    success = rescue_flight.request_as_rescue!(current_user)

    if success == false
      render status: :bad_request
    end

    render json: {rescue_flight: JsonService.rescue_flight(rescue_flight.reload)}
  end

  def flight_rescue_params
    params.permit(:flight_uuid, :rescue_uuid, flight_uuids: [], rescue_uuids: [])
  end
end
class MatchService
  class << self
    def flight_matches(flight)
      rescues = Rescue.
                  joins('LEFT JOIN rescue_airports as departing_rescue_airports on rescues.id=departing_rescue_airports.rescue_id').
                  joins('LEFT JOIN rescue_airports as arriving_rescue_airports on rescues.id=arriving_rescue_airports.rescue_id').
                  where(status: 'active').
                  where("available_from <= ?", flight.departing_at).
                  where(departing_rescue_airports: {airport_id: flight.departing_airport_id}).
                  where(arriving_rescue_airports: {airport_id: flight.arriving_airport_id}).
                  uniq

      rescues
    end

    def rescue_matches(_rescue)
      flights = Flight.active.
                  joins('LEFT JOIN rescue_airports as departing_rescue_airports on flights.departing_airport_id = departing_rescue_airports.airport_id').
                  joins('LEFT JOIN rescue_airports as arriving_rescue_airports on flights.arriving_airport_id = arriving_rescue_airports.airport_id').
                  where(departing_rescue_airports: {rescue_id: _rescue.id}).
                  where(arriving_rescue_airports: {rescue_id: _rescue.id}).
                  uniq

      flights
    end
  end
end
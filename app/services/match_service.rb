class MatchService
  class << self
    def flight_matches(flight)
      rescues = Rescue.
                  where(status: 'active').
                  where("available_from <= ?", flight.departing_at).
                  where("? = ANY(from_airports)", flight.departing_airport.code).
                  where("? = ANY(to_airports)", flight.arriving_airport.code)

      rescues
    end

    def rescue_matches(_rescue)
      departing_airport_ids = Airport.where(code: _rescue.from_airports).select(:id).map(&:id)
      arriving_airport_ids = Airport.where(code: _rescue.to_airports).select(:id).map(&:id)

      flights = Flight.active.
                  where("departing_airport_id in (?)", departing_airport_ids).
                  where("arriving_airport_id in (?)", arriving_airport_ids)

      flights
    end
  end
end
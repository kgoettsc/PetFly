class SuggestionService
  class << self
    def ensure_for_flight(flight)
      rescue_matches = MatchService.flight_matches(flight)

      existing_ids = flight.rescue_flights.select(:rescue_id)

      new_matches = rescue_matches.reject{|rm| existing_ids.includes?(rm.id)}

      rescue_matches.each do |_rescue|
        RescueFlight.create!(
          rescue: _rescue,
          flight: flight
        )
      end
    end

    def ensure_for_rescue(_rescue)
      flight_matches = MatchService.rescue_matches(_rescue)

      existing_ids = _rescue.rescue_flights.pluck(:flight_id)

      new_matches = flight_matches.reject{|fm| existing_ids.include?(fm.id)}

      new_matches.each do |flight|
        RescueFlight.create!(
          flight: flight,
          rescue: _rescue
        )
      end
    end
  end
end
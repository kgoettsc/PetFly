class FlightAwareService

  class << self
    def get_flight_info(flight_number)
      response = connection.get("FlightInfo",
                  {ident: flight_number},
                  {'Content-Type'=>'application/json'})

      body = JSON.parse(response.body)

      parse_flight_response(body["FlightInfoResult"]["flights"])
    end

    def parse_flight_response(flights)
      flights.map do |flight|
        {
          number: flight["ident"],
          departing_at: Time.at(flight["filed_departuretime"]).utc,
          arriving_at: Time.at(flight["estimatedarrivaltime"]).utc,
          departing_airport_code: flight["origin"][1..],
          arriving_airport_code: flight["destination"][1..]
        }
      end
    end

    def connection
      conn = Faraday.new(build_url)
      conn.basic_auth(ENV['FLIGHTAWARE_USERNAME'], ENV['FLIGHTAWARE_KEY'])

      conn
    end

    def build_url
      "https://#{ENV['FLIGHTAWARE_URL']}"
    end
  end

end
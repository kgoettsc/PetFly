class FlightAwareService

  def self.get_flight_info(flight_number)
    response = connection.get("FlightInfo",
                {ident: flight_number},
                {'Content-Type'=>'application/json'})

    response
  end

  def self.connection
    conn = Faraday.new(build_url)
    conn.basic_auth(ENV['FLIGHTAWARE_USERNAME'], ENV['FLIGHTAWARE_KEY'])

    conn
  end

  def self.build_url
    "https://#{ENV['FLIGHTAWARE_URL']}"
  end

end
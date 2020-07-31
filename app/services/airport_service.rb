require 'json'

class AirportService

  def self.seed_airports
    file = File.open("lib/data/us-airports.json")
    airport_data = JSON.load(file)
    errors = []
    successes = 0
    airport_data.each do |each_airport|
      airport = Airport.find_or_create_by(code: each_airport["code"])
      airport.update(name: each_airport["name"])

      successes+=1
    end

    puts "Loaded #{airport_data.count} and updated #{successes} of a total of #{Airport.count}"
    puts errors.join("\n")
  end
end
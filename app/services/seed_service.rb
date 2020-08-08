class SeedService
  class << self
    def clear_and_make
      clear_all_things
      make_new_stuff
      user_testing_stuff
    end

    def clear_all_things
      Rescue.delete_all
      Animal.delete_all
      Organization.delete_all
      Flight.delete_all
      User.where(uid: nil).each(&:delete)
    end

    def make_new_stuff
      100.times do
        user = User.create(
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          email: Faker::Internet.email
        )

        org_name = "#{Faker::Name.first_name}'s #{Faker::Creature::Animal.name.capitalize}s"
        organization = Organization.create(
          name: org_name,
          email: Faker::Internet.email
        )

        organization.users << user

        (rand(5)+1).times do

          if (rand(2) == 0)
            name = Faker::Creature::Dog.name
            kind = 'dog'
            breed = Faker::Creature::Dog.breed
          else
            name = Faker::Creature::Cat.name
            kind = 'cat'
            breed = Faker::Creature::Cat.breed
          end

          animal = Animal.create(
            name: name,
            info_url: "https://#{Faker::Internet.domain_name}",
            kind: kind,
            breed: breed
          )

          available_from = generate_random_date
          rand_airports = Airport.offset(rand(Airport.count)).sample(rand(2)+1)
          other_rand_airports = Airport.where.not(id: rand_airports.map(&:id)).offset(rand(Airport.count-1)).sample(rand(2)+1)

          Rescue.create(
            organization: organization,
            animal: animal,
            from_airports: rand_airports.map(&:code),
            to_airports: other_rand_airports.map(&:code),
            status: 'active',
            available_from: available_from
          )
        end
      end

      100.times do
        user = User.create(
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          email: Faker::Internet.email
        )

        (rand(15)+1).times do
          flight_date = generate_random_date + rand(1440).minutes

          rand_rescue = Rescue.offset(rand(Rescue.count)).first
          rescue_from = rand_rescue.from_airports[rand(rand_rescue.from_airports.count)]
          rescue_to = rand_rescue.to_airports[rand(rand_rescue.to_airports.count)]

          Flight.create(
            user: user,
            number: rand(9999),
            departing_at: flight_date,
            arriving_at: flight_date + rand(600).minutes,
            departing_airport: Airport.find_by(code: rescue_from),
            arriving_airport: Airport.find_by(code: rescue_to)
          )
        end
      end
    end

    def user_testing_stuff
      User.where.not(uid: nil).each do |user|
        Organization.all.sample(5).each do |org|
          org.users << user
        end
      end
    end

    def create_suggestions
      Rescue.find_each(batch_size: 100) do |_rescue|
        SuggestionService.ensure_for_rescue(_rescue)
      end
    end

    def generate_random_date
      Date.current + (rand * 60).days
    end
  end
end
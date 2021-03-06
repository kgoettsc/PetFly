class JsonService

  class << self
    def user(_user)
      return {} if _user.blank?

      _user.slice(
        :first_name,
        :last_name,
        :email,
        :uuid,
      ).merge({
        full_name: _user.full_name,
        is_admin: _user.admin?
      })
    end

    def organizations(_organizations)
      _organizations.map{|o| organization(o)}
    end

    def organization(_organization)
      _organization.slice(
        :name,
        :email,
        :url,
        :uuid,
      )
    end

    def rescues(_rescues)
      _rescues.map{|r| rescue_json(r)}
    end

    def rescue_json(_rescue)
      _rescue.slice(
        :status,
        :available_from,
        :uuid,
      ).merge(
        organization: organization(_rescue.organization),
        animal: animal(_rescue.animal),
        receiving_user: user(_rescue.receiving_user),
        departing_airports: _rescue.departing_airports,
        arriving_airports: _rescue.arriving_airports
      )
    end

    def rescue_flights(_rescue_flights)
      _rescue_flights.map{|rf| rescue_flight(rf)}
    end

    def rescue_flight(_rescue_flight)
      _flight = _rescue_flight.flight
      _rescue = _rescue_flight.rescue

      _rescue_flight.slice(
        :uuid,
        :status,
        :requested_at,
        :approved_at,
        :cancelled_at,
      ).merge(
        rescue_approver: user(_rescue_flight.rescue_approver),
        flight_approver: user(_rescue_flight.flight_approver),
        flight: JsonService.flight(_flight),
        rescue: JsonService.rescue_json(_rescue),
        rescue_uuid: _rescue.uuid,
        flight_uuid: _flight.uuid,
      )
    end

    def animal(_animal)
      _animal.slice(
        :name,
        :info_url,
        :kind,
        :breed
      )
    end

    def airports(_airports)
      _airports.map{|a| airport(a) }
    end

    def airport(_airport)
      return {} if _airport.blank?

      _airport.slice(
        :code,
        :name,
        :uuid
      )
    end

    def flights(_flights)
      _flights.map{|f| flight(f)}
    end

    def flight(_flight)
      _flight.slice(
        :uuid,
        :number,
        :can_transport,
        :departing_at,
        :arriving_at,
        :archived_at
      ).merge(
        departing_date: _flight.departing_date,
        arriving_date: _flight.arriving_date,
        departing_airport: airport(_flight.departing_airport),
        arriving_airport: airport(_flight.arriving_airport),
      )
    end
  end

end
class JsonService

  class << self
    def user(_user)
      _user.slice(
        :first_name,
        :last_name,
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
        :from_airports,
        :to_airports,
        :status,
        :uuid,
      ).merge(
        organization: organization(_rescue.organization),
        animal: animal(_rescue.animal),
        receiving_user: user(_rescue.receiving_user)
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
      _airport.slice(
        :code,
        :name,
        :uuid
      )
    end

    def user(_user)
      return {} unless _user

      _user.slice(
        :email,
        :first_name,
        :last_name,
        :uuid
      )
    end
  end

end
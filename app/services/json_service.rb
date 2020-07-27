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
  end

end
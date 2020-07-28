class RescuesController < ApplicationController

  def index

  end

  def active_by_user
    organizations = current_user.organizations.with_active_rescues

    rescues = organizations.flat_map(&:rescues)

    render json: {rescues: JsonService.rescues(rescues)}
  end
end
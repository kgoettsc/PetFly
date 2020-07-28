class RescuesController < ApplicationController

  def index

  end

  def show
    _rescue = Rescue.find_by(uuid: params[:id])

    render json: {rescue: JsonService.rescue_json(_rescue)}
  end

  def active_by_user
    organizations = current_user.organizations.with_active_rescues

    rescues = organizations.flat_map(&:rescues)

    render json: {rescues: JsonService.rescues(rescues)}
  end
end
class RescuesController < ApplicationController

  def index

  end

  def active
    # figure out ordering at somepoint
    rescues = Rescue.active.order(:created_at).limit(50)

    render json: {rescues: JsonService.rescues(rescues)}
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

  def create
    organization = Organization.find_by(uuid: rescue_params[:organization_uuid])
    receiving_user = User.find_by(uuid: rescue_params[:receiving_user_uuid])

    animal = Animal.create(
      name: rescue_params[:name],
      kind: rescue_params[:kind],
      breed: rescue_params[:breed],
      info_url: rescue_params[:info_url],
    )

    _rescue = Rescue.create(
      animal: animal,
      organization: organization,
      receiving_user: receiving_user,
      status: "active"
    )

    render json: {rescue: JsonService.rescue_json(_rescue)}
  end

  def rescue_params
    params.permit(:name, :kind, :breed, :info_url, :organization_uuid, :receiving_user_uuid)
  end
end
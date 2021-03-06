class RescuesController < ApplicationController

  def index

  end

  def active
    # figure out ordering at somepoint
    rescues = Rescue.includes(:organization, :animal, :receiving_user, :departing_airports, :arriving_airports).active.order(:created_at).limit(50)

    render json: {rescues: JsonService.rescues(rescues)}
  end

  def show
    _rescue = Rescue.find_by(uuid: params[:id])

    render json: {rescue: JsonService.rescue_json(_rescue)}
  end

  def active_by_user_organizations
    organizations = current_user.organizations.with_active_rescues

    rescues = organizations.flat_map(&:rescues)

    render json: {rescues: JsonService.rescues(rescues)}
  end

  def active_by_receiving_user
    rescues = Rescue.includes(:organization, :animal, :receiving_user, :departing_airports, :arriving_airports)
                    .active
                    .where(receiving_user: current_user)
                    .order(:created_at)
                    .limit(50)

    render json: {rescues: JsonService.rescues(rescues)}
  end

  def create
    organization = Organization.find_by(uuid: rescue_params[:organization_uuid])
    receiving_user = User.find_by(email: rescue_params[:receiving_user_email])

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
      available_from: params[:available_from],
      status: params[:status] || "active",
    )

    departing_airports = Airport.where(uuid: rescue_params[:departing_airport_uuids])
    arriving_airports = Airport.where(uuid: rescue_params[:arriving_airport_uuids])
    _rescue.departing_airports = departing_airports
    _rescue.arriving_airports = arriving_airports

    render json: {rescue: JsonService.rescue_json(_rescue)}
  end

  def update
    organization = Organization.find_by(uuid: rescue_params[:organization_uuid])
    receiving_user = User.find_by(email: rescue_params[:receiving_user_email])

    _rescue = Rescue.includes(:animal).find_by(uuid: params[:id])
    animal = _rescue.animal

    animal.update!(
      name: rescue_params[:name],
      kind: rescue_params[:kind],
      breed: rescue_params[:breed],
      info_url: rescue_params[:info_url]
    )

    _rescue.update!(
      organization: organization,
      receiving_user: receiving_user,
      available_from: params[:available_from],
      status: params[:status],
    )

    departing_airports = Airport.where(uuid: rescue_params[:departing_airport_uuids])
    arriving_airports = Airport.where(uuid: rescue_params[:arriving_airport_uuids])
    _rescue.departing_airports = departing_airports
    _rescue.arriving_airports = arriving_airports

    render json: {rescue: JsonService.rescue_json(_rescue)}
  end

  def matches
    _rescue = Rescue.find_by(uuid: params[:id])

    matches = MatchService.rescue_matches(_rescue)

    render json: {matches: JsonService.flights(matches)}
  end

  def rescue_params
    params.permit(:name, :kind, :breed, :available_from, :info_url, :status, :organization_uuid, :receiving_user_email, departing_airport_uuids: [], arriving_airport_uuids: [])
  end
end
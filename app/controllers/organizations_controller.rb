class OrganizationsController < ApplicationController

  def index
    organizations = current_user.organizations

    render json: {organizations: JsonService.organizations(organizations)}
  end

  def by_user
    organizations = User.includes(:organizations).find_by(uuid: org_params[:user_uuid]).organizations

    render json: {organizations: JsonService.organizations(organizations)}
  end

  def org_params
    params.permit(:user_uuid)
  end
end
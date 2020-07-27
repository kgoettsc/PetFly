class UserAuthsController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :ensure_logged_in

  def index
    render json: {user: JsonService.user(current_user)}
  end
end
class SessionsController < ApplicationController
  skip_before_action :ensure_logged_in

  def create
    begin
      user = User.from_omniauth(request.env["omniauth.auth"])
      session[:user_id] = user.id
      redirect_to root_path
    rescue => e
      redirect_to root_path
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

  def unauthorized

  end
end

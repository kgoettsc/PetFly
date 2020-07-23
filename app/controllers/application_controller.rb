class ApplicationController < ActionController::Base
  helper_method :current_user

  def current_user
    begin
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    rescue => e
      @current_user = nil
    end
  end

  def ensure_karl
    redirect_to root_path unless current_user.karl?
  end
end

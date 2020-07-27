class ApplicationController < ActionController::Base
  helper_method :current_user
  before_action :ensure_logged_in

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

  def ensure_logged_in
    redirect_to login_index_path unless current_user.present?	    redirect_to login_index_path unless current_user.present?
  end
end

class UsersController < ApplicationController

  def show
    @users = User.all.as_json
  end
end
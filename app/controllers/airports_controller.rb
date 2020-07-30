class AirportsController < ApplicationController

  def index
    airports = JsonService.airports(Airport.all)

    render json: {airports: airports}
  end
end
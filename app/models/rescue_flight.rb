# == Schema Information
#
# Table name: rescue_flights
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  rescue_id  :bigint
#  flight_id  :bigint
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class RescueFlight < ActiveRecord::Base
  include Uuidable

  belongs_to :rescue
  belongs_to :flight

end

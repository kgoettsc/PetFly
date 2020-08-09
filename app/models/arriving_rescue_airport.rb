# == Schema Information
#
# Table name: rescue_airports
#
#  id          :bigint           not null, primary key
#  uuid        :uuid
#  rescue_id   :bigint
#  airport_id  :bigint
#  type        :string
#  archived_at :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ArrivingRescueAirport < RescueAirport

end

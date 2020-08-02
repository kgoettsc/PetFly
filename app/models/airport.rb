# == Schema Information
#
# Table name: airports
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  code       :string
#  latitude   :float
#  longitude  :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Airport < ActiveRecord::Base
  include Uuidable

  has_many :departing_flights, class_name: 'Flight', foreign_key: 'departing_airport_id'
  has_many :arriving_flights, class_name: 'Flight', foreign_key: 'arriving_airport_id'

end

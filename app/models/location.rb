# == Schema Information
#
# Table name: locations
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  latitude   :float
#  longitude  :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Location < ActiveRecord::Base

end

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

  has_many :rescues_from, class_name: 'Rescue', foreign_key: 'from_id'
  has_many :rescues_to, class_name: 'Rescue', foreign_key: 'to_id'

end

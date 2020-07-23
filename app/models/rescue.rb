# == Schema Information
#
# Table name: rescues
#
#  id                :bigint           not null, primary key
#  uuid              :uuid
#  organization_id   :bigint
#  animal_id         :bigint
#  receiving_user_id :bigint
#  from_id           :bigint
#  to_id             :bigint
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class Rescue < ActiveRecord::Base

  belongs_to :organization
  belongs_to :animal
  belongs_to :receiving_user, class_name: 'User'
  belongs_to :from, class_name: 'Location'
  belongs_to :to, class_name: 'Location'

  has_many :rescue_flights
end

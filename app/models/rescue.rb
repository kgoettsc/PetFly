# == Schema Information
#
# Table name: rescues
#
#  id                :bigint           not null, primary key
#  uuid              :uuid
#  organization_id   :bigint
#  animal_id         :bigint
#  receiving_user_id :bigint
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  status            :string
#  available_from    :date
#

class Rescue < ActiveRecord::Base
  include Uuidable

  belongs_to :organization
  belongs_to :animal
  belongs_to :receiving_user, class_name: 'User', optional: true
  belongs_to :from, class_name: 'Location', optional: true
  belongs_to :to, class_name: 'Location', optional: true

  has_many :rescue_flights
  has_one :rescue_flight, -> { active }

  has_many :departing_rescue_airports
  has_many :departing_airports, through: :departing_rescue_airports, source: :airport
  has_many :arriving_rescue_airports
  has_many :arriving_airports, through: :arriving_rescue_airports, source: :airport

  scope :active, -> {where(status: 'active')}
end

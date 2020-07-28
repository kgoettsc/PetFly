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
#  from_airports     :string           default([]), is an Array
#  to_airports       :string           default([]), is an Array
#  status            :string
#

class Rescue < ActiveRecord::Base
  include Uuidable

  belongs_to :organization
  belongs_to :animal
  belongs_to :receiving_user, class_name: 'User', optional: true
  belongs_to :from, class_name: 'Location', optional: true
  belongs_to :to, class_name: 'Location', optional: true

  has_many :rescue_flights

  scope :active, -> {where(status: 'active')}
end

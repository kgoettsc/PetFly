# == Schema Information
#
# Table name: flights
#
#  id                   :bigint           not null, primary key
#  uuid                 :uuid
#  number               :string
#  user_id              :bigint
#  can_transport        :boolean
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  departing_at         :datetime         not null
#  arriving_at          :datetime         not null
#  archived_at          :datetime         not null
#  departing_airport_id :bigint
#  arriving_airport_id  :bigint
#

class Flight < ActiveRecord::Base
  include Uuidable

  scope :pending, -> {where('departing_at >= ?', DateTime.current)}
  scope :unarchived, -> {where(archived_at: nil)}
  scope :active, -> {pending.unarchived}

  belongs_to :user
  belongs_to :departing_airport, class_name: 'Airport', optional: true
  belongs_to :arriving_airport, class_name: 'Airport', optional: true

  has_many :rescue_flights

  def departing_date
    departing_at.to_date
  end

  def arriving_date
    arriving_at.to_date
  end

end

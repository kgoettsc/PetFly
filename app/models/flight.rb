# == Schema Information
#
# Table name: flights
#
#  id            :bigint           not null, primary key
#  uuid          :uuid
#  number        :string
#  user_id       :bigint
#  can_transport :boolean
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Flight < ActiveRecord::Base
  include Uuidable

  belongs_to :user

  has_many :rescue_flights

end

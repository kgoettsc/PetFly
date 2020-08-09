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

class RescueAirport < ActiveRecord::Base

  belongs_to :rescue
  belongs_to :airport

  def archive!(archived_at = DateTime.current)
    self.update!(archived_at: archived_at)
  end
end

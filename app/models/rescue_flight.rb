# == Schema Information
#
# Table name: rescue_flights
#
#  id                 :bigint           not null, primary key
#  uuid               :uuid
#  rescue_id          :bigint
#  flight_id          :bigint
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  rescue_approver_id :bigint
#  flight_approver_id :bigint
#  status             :string
#  requested_at       :datetime
#  approved_at        :datetime
#  cancelled_at       :datetime
#

class RescueFlight < ActiveRecord::Base
  include Uuidable

  validates_uniqueness_of :rescue_id, scope: [:flight_id, :cancelled_at]

  belongs_to :rescue
  belongs_to :flight

  belongs_to :rescue_approver, class_name: 'User', optional: true
  belongs_to :flight_approver, class_name: 'User', optional: true

  before_save :calculate_status

  scope :active, -> {where(cancelled_at: nil)}

  def calculate_status
    if cancelled_at.present?
      self.status = 'cancelled'
    elsif approved_at.present?
      self.status = 'approved'
    elsif requested_at.present?
      self.status = 'requested'
    elsif rescue_approver_id.blank? && flight_approver_id.blank?
      self.status = 'suggested'
    end
  end

  def active?
    self.cancelled_at.blank?
  end

  def requested?
    self.requested_at.present?
  end

  def approved?
    self.approved_at.present?
  end

  def cancelled?
    self.cancelled_at.present?
  end

  def can_request?
    !requested? &&
      !approved? &&
      !cancelled?
  end

  def request_as_rescue!(user)
    if !can_request?
      return false
    end

    self.update!(
      rescue_approver: user,
      requested_at: DateTime.current,
    )
  end

  def request_as_flight!(user)
    if !can_request?
      return false
    end

    self.update!(
      flight_approver: user,
      requested_at: DateTime.current,
    )
  end


end

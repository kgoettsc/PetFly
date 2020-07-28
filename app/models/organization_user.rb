# == Schema Information
#
# Table name: organization_users
#
#  id              :bigint           not null, primary key
#  uuid            :uuid
#  organization_id :bigint
#  user_id         :bigint
#  archived_at     :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class OrganizationUser < ActiveRecord::Base
  include Uuidable

  before_destroy :archive

  belongs_to :organization
  belongs_to :user

  validates_uniqueness_of :user_id, scope: [:organization_id, :archived_at]

  scope :active, -> {where(archived_at: nil)}

  default_scope -> {active}

  def archive(archived_at = DateTime.now)
    update!(archived_at: archived_at)
  end

end

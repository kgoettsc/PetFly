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

  belongs_to :organization
  belongs_to :user

end

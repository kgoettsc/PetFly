# == Schema Information
#
# Table name: organizations
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  email      :string
#  latitude   :float
#  longitude  :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Organization < ActiveRecord::Base

  has_many :rescues
  has_many :organization_users
  has_many :users, through: :organization_users

end

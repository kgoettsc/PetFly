# == Schema Information
#
# Table name: users
#
#  id               :bigint           not null, primary key
#  first_name       :string
#  last_name        :string
#  email            :string
#  uuid             :uuid
#  provider         :string
#  uid              :string
#  oauth_token      :string
#  oauth_expires_at :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class User < ActiveRecord::Base
  include ActiveModel::Serialization
  include Uuidable

  has_many :rescues_receiving, class_name: 'Rescue', foreign_key: 'receiving_user_id'

  has_many :organization_users
  has_many :organizations, through: :organization_users

  validates_presence_of :email
  validates_uniqueness_of :email

  def self.from_omniauth(auth)
    email = auth.info.email
    user = User.find_by(email: email)

    raise "Not Authorized" unless user.present?

    user.tap do |user|
      user.provider = auth.provider
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      user.uid = auth.uid
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end

  def full_name
    return "" unless first_name.present? && last_name.present?
    "#{first_name} #{last_name}"
  end

  def admin?
    email == "pvtidaho@gmail.com"
  end

end

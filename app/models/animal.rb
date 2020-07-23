# == Schema Information
#
# Table name: animals
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  type       :string
#  info_url   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Animal < ActiveRecord::Base

  has_many :rescues

end

# == Schema Information
#
# Table name: animals
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  info_url   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  kind       :string
#  breed      :string
#

class Animal < ActiveRecord::Base
  include Uuidable

  has_many :rescues

end
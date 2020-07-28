# == Schema Information
#
# Table name: airports
#
#  id         :bigint           not null, primary key
#  uuid       :uuid
#  name       :string
#  code       :string
#  latitude   :float
#  longitude  :float
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Airport < ActiveRecord::Base
  include Uuidable

end

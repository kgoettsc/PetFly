# == Schema Information
#
# Table name: rescues
#
#  id                   :bigint           not null, primary key
#  uuid                 :uuid
#  organization_id      :bigint
#  animal_id            :bigint
#  receiving_user_id_id :bigint
#  from_id              :bigint
#  to_id                :bigint
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class Rescue < ActiveRecord::Base

end

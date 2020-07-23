module Uuidable
  extend ActiveSupport::Concern

  included do
    validates_presence_of :uuid
    before_validation :ensure_uuid
  end

  def ensure_uuid
    return true if self.uuid.present?

    self.uuid = SecureRandom.uuid
  end
end
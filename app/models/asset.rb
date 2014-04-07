require 'digest'

class Asset < ActiveRecord::Base
  mount_uploader :upload, FileUploader

  before_save :update_digest

  def digest
    if upload_changed? && upload.file.present? && upload.file.respond_to?(:path) && File.exists?(upload.file.path)
      sha = Digest::SHA1.new
      sha.file(upload.file.path).hexdigest
    else
      self[:digest]
    end
  end

  private

  def update_digest
    self.digest = digest if upload_changed?
  end
end
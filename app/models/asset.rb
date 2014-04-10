class Asset < ActiveRecord::Base
  dragonfly_accessor :file
  belongs_to :asset_group

  scope :images, -> { where(file_image: true) }

  attr_accessor :download
end
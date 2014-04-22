class Asset < ActiveRecord::Base
  dragonfly_accessor :file
  belongs_to :asset_group

  # scope :images, -> { where(file_image: true) }
  scope :images, -> { where(file_format: [:jpeg, :jpg, :gif, :png]) }

  attr_accessor :download
end
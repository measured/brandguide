class Asset < ActiveRecord::Base
  dragonfly_accessor :file
  belongs_to :asset_group

  has_many :asset_bundle_assets
  has_many :asset_bundles, through: :asset_bundle_assets

  # scope :images, -> { where(file_image: true) }
  scope :images, -> { where(file_format: [:jpeg, :jpg, :gif, :png]) }

  attr_accessor :download
end
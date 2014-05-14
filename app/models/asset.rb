class Asset < ActiveRecord::Base
  dragonfly_accessor :file
  belongs_to :asset_group

  has_many :asset_bundle_assets
  has_many :asset_bundles, through: :asset_bundle_assets

  # scope :images, -> { where(file_image: true) }
  scope :images, -> { where(file_format: [:jpeg, :jpg, :gif, :png]) }

  attr_accessor :download

  def api_attributes
    {
      id: id,
      name: file.name,
      type: file.mime_type,
      size: file.size,
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end
end
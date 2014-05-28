class Asset < ActiveRecord::Base
  dragonfly_accessor :file
  belongs_to :asset_group

  has_many :asset_bundle_assets
  has_many :asset_bundles, through: :asset_bundle_assets

  scope :images, -> { where(file_format: [:jpeg, :jpg, :gif, :png]) }
  default_scope { order(created_at: :asc) }

  validates :file, presence: true, on: :create

  attr_accessor :download

  include ActionView::Helpers::NumberHelper

  def api_attributes
    {
      id: id,
      name: file.name,
      type: file.mime_type,
      format: file_format,
      size: number_to_human_size(file.size),
      pick: is_image?,
      images: {
        thumbnail: thumbnail
      },
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end

  def extension
    file.name.split('.').pop
  end

  def is_image?
    !!file.mime_type.match(/image/) && !file.mime_type.match(/svg/)
  end

  def thumbnail
    available_extensions = %w(ai indd)

    ext = if available_extensions.include?(extension)
      extension
    else
      'default'
    end

    if is_image?
      file.thumb('240x240^').url
    else
      "/assets/thumbnail_#{ext}.svg"
    end
  end
end
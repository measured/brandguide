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
      name: name,
      type: mime_type,
      format: format,
      size: number_to_human_size(size),
      pick: is_image?,
      images: {
        thumbnail: thumbnail
      },
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end

  def name
    update_attribute(:file_name, file.name) unless file_name
    file_name
  end

  def format
    update_attribute(:file_format, file.format) unless file_format
    file_format
  end

  def extension
    name.split('.').pop
  end

  def size
    update_attribute(:file_size, file.size) unless file_size
    file_size
  end

  def mime_type
    update_attribute(:file_mime_type, file.mime_type) unless file_mime_type
    file_mime_type
  end

  def is_image?
    !!mime_type.match(/image/) && !mime_type.match(/svg/)
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
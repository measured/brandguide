class AssetGroup < ActiveRecord::Base
  belongs_to :section
  has_many :assets

  accepts_nested_attributes_for :assets

  delegate :brand_guide, to: :section, allow_nil: true
  validates :type, presence: true

  after_initialize :default_attributes

  def self.type_options
    [
      ['Files', FileAssetGroup]
    ]
  end

  def has_thumb?
    assets.images.present?
  end

  def thumb(geometry)
    if has_thumb?
      assets.images.first.file.thumb(geometry)
    end
  end

  private

  def default_attributes
    self.type = type.presence || 'FileAssetGroup'
  end
end
class AssetGroup < ActiveRecord::Base
  belongs_to :section
  has_many :assets

  accepts_nested_attributes_for :assets

  delegate :guide, to: :section, allow_nil: true

  default_scope { order(created_at: :asc) }

  def api_attributes
    {
      id: id,
      title: title,
      assets: assets.map(&:api_attributes),
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end

  def has_thumb?
    assets.images.present?
  end

  def thumb(geometry)
    if has_thumb?
      assets.images.first.file.thumb(geometry)
    end
  end
end
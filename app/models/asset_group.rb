class AssetGroup < ActiveRecord::Base
  belongs_to :section, touch: true
  has_many :assets

  accepts_nested_attributes_for :assets, allow_destroy: true

  delegate :guide, to: :section, allow_nil: true

  default_scope { order(created_at: :asc) }

  include ActionView::Helpers::NumberHelper

  def api_attributes
    {
      id: id,
      title: (title || 'Untitled'),
      assets: assets.map(&:api_attributes),
      size: number_to_human_size(assets.map(&:file).map(&:size).inject(:+)),
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
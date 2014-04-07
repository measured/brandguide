class AssetGroup < ActiveRecord::Base
  belongs_to :section
  has_many :assets

  def has_thumb?
    assets.images.present?
  end

  def thumb(geometry)
    if has_thumb?
      assets.images.first.file.thumb(geometry)
    end
  end
end
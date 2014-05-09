class AssetBundle < ActiveRecord::Base
  extend FriendlyId

  belongs_to :guide

  validates :access_key, presence: true, uniqueness: true
  validates :guide_id, presence: true

  has_many :asset_bundle_assets
  has_many :assets, through: :asset_bundle_assets

  friendly_id :generate_access_key, use: :slugged, slug_column: :access_key

  attr_accessor :recipient, :message

  def generate_access_key
    SecureRandom.hex(32)
  end
end
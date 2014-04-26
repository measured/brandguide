class AssetBundleAsset < ActiveRecord::Base
  belongs_to :asset_bundle
  belongs_to :asset
end
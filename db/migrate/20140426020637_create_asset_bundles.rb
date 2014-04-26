class CreateAssetBundles < ActiveRecord::Migration
  def change
    create_table :asset_bundles do |t|
      t.timestamps

      t.references :brand_guide, null: false
      t.string :access_key, null: false
    end

    add_index :asset_bundles, :access_key, unique: true

    create_table :asset_bundle_assets do |t|
      t.timestamps

      t.references :asset, :asset_bundle
    end
  end
end

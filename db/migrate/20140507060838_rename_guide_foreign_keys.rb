class RenameGuideForeignKeys < ActiveRecord::Migration
  def change
    rename_column :asset_bundles, :brand_guide_id, :guide_id
    rename_column :sections, :brand_guide_id, :guide_id
  end
end

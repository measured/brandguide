class RenameBrandGuidesToGuides < ActiveRecord::Migration
  def change
    rename_table :brand_guides, :guides
  end
end

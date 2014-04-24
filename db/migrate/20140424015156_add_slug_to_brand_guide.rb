class AddSlugToBrandGuide < ActiveRecord::Migration
  def change
    remove_column :brand_guides, :subdomain, :string
    add_column :brand_guides, :slug, :string

    add_index :brand_guides, :slug, unique: true
  end
end

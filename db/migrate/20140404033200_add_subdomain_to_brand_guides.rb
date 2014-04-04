class AddSubdomainToBrandGuides < ActiveRecord::Migration
  def change
    add_column :brand_guides, :subdomain, :string
  end
end

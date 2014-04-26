class AddTypeToAssetGroups < ActiveRecord::Migration
  def change
    add_column :asset_groups, :type, :string
  end
end

class CreateAssetGroups < ActiveRecord::Migration
  def change
    create_table :asset_groups do |t|
      t.timestamps

      t.references :section
      t.string :title
    end

    add_reference :assets, :asset_group
  end
end

class AddPasswordToBrandGuides < ActiveRecord::Migration
  def change
    add_column :brand_guides, :password, :string
  end
end

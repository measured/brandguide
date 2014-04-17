class AddOriginalFilenameToAssets < ActiveRecord::Migration
  def change
    add_column :assets, :original_filename, :string
    add_column :assets, :digest, :string
  end
end

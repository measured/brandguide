class AddFileSizeToAssets < ActiveRecord::Migration
  def change
    add_column :assets, :file_size, :integer
  end
end

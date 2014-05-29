class AddFileMimeTypeToAssets < ActiveRecord::Migration
  def change
    add_column :assets, :file_mime_type, :string
  end
end

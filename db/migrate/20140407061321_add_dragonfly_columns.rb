class AddDragonflyColumns < ActiveRecord::Migration
  def change
    remove_column :assets, :upload
    remove_column :assets, :content_type
    remove_column :assets, :original_filename
    remove_column :assets, :digest
    remove_column :assets, :file_size

    add_column :assets, :file_uid, :string
    add_column :assets, :file_name, :string
  end
end

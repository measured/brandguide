class AddAssets < ActiveRecord::Migration
  def change
    create_table :assets do |t|
      t.timestamps

      t.string :upload, :content_type
      t.integer :file_size
    end
  end
end

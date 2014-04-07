class AddDragonflyAnalysisColumns < ActiveRecord::Migration
  def change
    add_column :assets, :file_image, :boolean
    add_column :assets, :file_width, :integer
    add_column :assets, :file_height, :integer
    add_column :assets, :file_format, :string
  end
end

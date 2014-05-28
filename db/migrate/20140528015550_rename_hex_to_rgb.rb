class RenameHexToRgb < ActiveRecord::Migration
  def change
    rename_column :colours, :hex, :rgb
  end
end

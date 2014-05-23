class RenameDisplayToHex < ActiveRecord::Migration
  def change
    rename_column :colours, :display, :hex
  end
end

class RemoveTypeFromSections < ActiveRecord::Migration
  def change
    remove_column :sections, :type, :string
  end
end

class AddSortOrderToSections < ActiveRecord::Migration
  def change
    add_column :sections, :sort_order, :integer, default: 0
  end
end

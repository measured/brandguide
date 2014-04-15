class AddRowOrderToSections < ActiveRecord::Migration
  def change
    add_column :sections, :row_order, :integer, null: false, default: 0
  end
end
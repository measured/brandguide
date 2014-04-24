class RemoveRowOrderFromSections < ActiveRecord::Migration
  def change
    remove_column :sections, :row_order, :integer
  end
end

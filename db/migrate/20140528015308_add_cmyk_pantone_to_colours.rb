class AddCmykPantoneToColours < ActiveRecord::Migration
  def change
    add_column :colours, :cmyk, :string
    add_column :colours, :pantone, :string
  end
end

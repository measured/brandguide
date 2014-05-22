class AddColours < ActiveRecord::Migration
  def change
    create_table :colours do |t|
      t.timestamps

      t.string :title
      t.string :display
      t.references :section
    end
  end
end

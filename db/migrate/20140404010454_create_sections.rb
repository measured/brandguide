class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.timestamps

      t.string :title, null: false
      t.string :ancestry
      t.references :brand_guide
      t.text :content
    end

    add_index :sections, :ancestry
  end
end

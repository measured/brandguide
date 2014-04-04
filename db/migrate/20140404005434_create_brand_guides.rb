class CreateBrandGuides < ActiveRecord::Migration
  def change
    create_table :brand_guides do |t|
      t.timestamps

      t.string :title, null: false
    end
  end
end

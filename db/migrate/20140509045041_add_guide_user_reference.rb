class AddGuideUserReference < ActiveRecord::Migration
  def change
    change_table :guides do |t|
      t.references :user
    end
  end
end

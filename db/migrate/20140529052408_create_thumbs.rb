class CreateThumbs < ActiveRecord::Migration
  def change
    create_table :thumbs do |t|
      t.timestamps
      t.string :signature, :uid
    end
  end
end

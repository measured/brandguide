# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140521061213) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "asset_bundle_assets", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "asset_id"
    t.integer  "asset_bundle_id"
  end

  create_table "asset_bundles", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "guide_id",   null: false
    t.string   "access_key", null: false
  end

  add_index "asset_bundles", ["access_key"], name: "index_asset_bundles_on_access_key", unique: true, using: :btree

  create_table "asset_groups", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "section_id"
    t.string   "title"
    t.string   "type"
  end

  create_table "assets", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "asset_group_id"
    t.string   "file_uid"
    t.string   "file_name"
    t.boolean  "file_image"
    t.integer  "file_width"
    t.integer  "file_height"
    t.string   "file_format"
  end

  create_table "colours", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "display"
    t.integer  "section_id"
  end

  create_table "friendly_id_slugs", force: true do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
  add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
  add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
  add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

  create_table "guides", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",      null: false
    t.string   "slug"
    t.string   "password"
    t.integer  "user_id"
  end

  add_index "guides", ["slug"], name: "index_guides_on_slug", unique: true, using: :btree

  create_table "sections", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",      null: false
    t.string   "ancestry"
    t.integer  "guide_id"
    t.text     "content"
    t.string   "slug"
  end

  add_index "sections", ["ancestry"], name: "index_sections_on_ancestry", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "authentication_token",                null: false
  end

  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end

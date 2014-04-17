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

ActiveRecord::Schema.define(version: 20140415010335) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "asset_groups", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "section_id"
    t.string   "title"
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

  create_table "brand_guides", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",      null: false
    t.string   "subdomain"
  end

  create_table "sections", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",                      null: false
    t.string   "ancestry"
    t.integer  "brand_guide_id"
    t.text     "content"
    t.integer  "row_order",      default: 0, null: false
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
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end

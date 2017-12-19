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

ActiveRecord::Schema.define(version: 20171211165534) do

  create_table "deltas", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.text "content"
    t.bigint "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "votes", default: 0
    t.string "user"
    t.index ["retro_id"], name: "index_deltas_on_retro_id"
  end

  create_table "pluses", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.text "content"
    t.bigint "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "votes", default: 0
    t.string "user"
    t.index ["retro_id"], name: "index_pluses_on_retro_id"
  end

  create_table "retros", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "key", limit: 191
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "team_id"
    t.index ["key"], name: "index_retros_on_key", unique: true
    t.index ["team_id"], name: "index_retros_on_team_id"
  end

  create_table "teams", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "name"
    t.string "password_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "deltas", "retros"
  add_foreign_key "pluses", "retros"
  add_foreign_key "retros", "teams"
end

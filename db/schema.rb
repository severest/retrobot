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

ActiveRecord::Schema.define(version: 2018_06_21_162025) do

  create_table "delta_votes", force: :cascade do |t|
    t.string "user"
    t.bigint "delta_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["delta_id"], name: "index_delta_votes_on_delta_id"
  end

  create_table "deltas", force: :cascade do |t|
    t.text "content"
    t.integer "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user"
    t.text "notes"
    t.index ["retro_id"], name: "index_deltas_on_retro_id"
  end

  create_table "pluses", force: :cascade do |t|
    t.text "content"
    t.integer "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user"
    t.index ["retro_id"], name: "index_pluses_on_retro_id"
  end

  create_table "retros", force: :cascade do |t|
    t.string "key", limit: 191
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "team_id"
    t.integer "status", default: 2
    t.string "creator"
    t.integer "max_votes", default: 2
    t.integer "time_limit_minutes", default: 5
    t.index ["key"], name: "index_retros_on_key", unique: true
    t.index ["team_id"], name: "index_retros_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.string "password_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

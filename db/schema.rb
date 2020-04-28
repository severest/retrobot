# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_28_195433) do

  create_table "delayed_jobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "delta_group_items", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "delta_group_id"
    t.bigint "delta_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["delta_group_id"], name: "index_delta_group_items_on_delta_group_id"
    t.index ["delta_id"], name: "delta_group_items_unique_delta_id", unique: true
    t.index ["delta_id"], name: "index_delta_group_items_on_delta_id"
  end

  create_table "delta_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["retro_id"], name: "index_delta_groups_on_retro_id"
  end

  create_table "delta_votes", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "user"
    t.bigint "delta_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["delta_id"], name: "index_delta_votes_on_delta_id"
  end

  create_table "deltas", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "content"
    t.bigint "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user"
    t.text "notes"
    t.index ["retro_id"], name: "index_deltas_on_retro_id"
  end

  create_table "pluses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "content"
    t.bigint "retro_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user"
    t.index ["retro_id"], name: "index_pluses_on_retro_id"
  end

  create_table "retros", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "key", limit: 191
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "team_id"
    t.integer "status", default: 2
    t.string "creator"
    t.integer "max_votes", default: 2
    t.integer "time_limit_minutes", default: 5
    t.boolean "include_temperature_check", default: false
    t.index ["key"], name: "index_retros_on_key", unique: true
    t.index ["team_id"], name: "index_retros_on_team_id"
  end

  create_table "teams", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "password_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "temperature_checks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "retro_id"
    t.float "temperature"
    t.text "notes"
    t.string "user"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["retro_id"], name: "index_temperature_checks_on_retro_id"
  end

  add_foreign_key "delta_group_items", "delta_groups"
  add_foreign_key "delta_group_items", "deltas"
  add_foreign_key "delta_groups", "retros"
  add_foreign_key "delta_votes", "deltas"
  add_foreign_key "deltas", "retros"
  add_foreign_key "pluses", "retros"
  add_foreign_key "retros", "teams"
end

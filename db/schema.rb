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

ActiveRecord::Schema.define(version: 2020_07_27_171948) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "airports", force: :cascade do |t|
    t.uuid "uuid"
    t.string "name"
    t.string "code"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "animals", force: :cascade do |t|
    t.uuid "uuid"
    t.string "name"
    t.string "type"
    t.string "info_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "flights", force: :cascade do |t|
    t.uuid "uuid"
    t.string "number"
    t.bigint "user_id"
    t.boolean "can_transport"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_flights_on_user_id"
  end

  create_table "locations", force: :cascade do |t|
    t.uuid "uuid"
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "organization_users", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "organization_id"
    t.bigint "user_id"
    t.datetime "archived_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["organization_id"], name: "index_organization_users_on_organization_id"
    t.index ["user_id"], name: "index_organization_users_on_user_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.uuid "uuid"
    t.string "name"
    t.string "email"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "url"
  end

  create_table "rescue_flights", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "rescue_id"
    t.bigint "flight_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["flight_id"], name: "index_rescue_flights_on_flight_id"
    t.index ["rescue_id"], name: "index_rescue_flights_on_rescue_id"
  end

  create_table "rescues", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "organization_id"
    t.bigint "animal_id"
    t.bigint "receiving_user_id"
    t.bigint "from_id"
    t.bigint "to_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "from_airports", default: [], array: true
    t.string "to_airports", default: [], array: true
    t.index ["animal_id"], name: "index_rescues_on_animal_id"
    t.index ["from_id"], name: "index_rescues_on_from_id"
    t.index ["organization_id"], name: "index_rescues_on_organization_id"
    t.index ["receiving_user_id"], name: "index_rescues_on_receiving_user_id"
    t.index ["to_id"], name: "index_rescues_on_to_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.uuid "uuid"
    t.string "provider"
    t.string "uid"
    t.string "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end

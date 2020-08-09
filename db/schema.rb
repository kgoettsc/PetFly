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

ActiveRecord::Schema.define(version: 2020_08_09_035607) do

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
    t.string "info_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "kind"
    t.string "breed"
  end

  create_table "flights", force: :cascade do |t|
    t.uuid "uuid"
    t.string "number"
    t.bigint "user_id"
    t.boolean "can_transport"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "departing_at", null: false
    t.datetime "arriving_at", null: false
    t.datetime "archived_at"
    t.bigint "departing_airport_id"
    t.bigint "arriving_airport_id"
    t.index ["arriving_airport_id"], name: "index_flights_on_arriving_airport_id"
    t.index ["departing_airport_id"], name: "index_flights_on_departing_airport_id"
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

  create_table "rescue_airports", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "rescue_id"
    t.bigint "airport_id"
    t.string "type"
    t.datetime "archived_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["airport_id"], name: "index_rescue_airports_on_airport_id"
    t.index ["rescue_id"], name: "index_rescue_airports_on_rescue_id"
  end

  create_table "rescue_flights", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "rescue_id"
    t.bigint "flight_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "rescue_approver_id"
    t.bigint "flight_approver_id"
    t.string "status"
    t.datetime "requested_at"
    t.datetime "approved_at"
    t.datetime "cancelled_at"
    t.index ["flight_approver_id"], name: "index_rescue_flights_on_flight_approver_id"
    t.index ["flight_id"], name: "index_rescue_flights_on_flight_id"
    t.index ["rescue_approver_id"], name: "index_rescue_flights_on_rescue_approver_id"
    t.index ["rescue_id"], name: "index_rescue_flights_on_rescue_id"
  end

  create_table "rescues", force: :cascade do |t|
    t.uuid "uuid"
    t.bigint "organization_id"
    t.bigint "animal_id"
    t.bigint "receiving_user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status"
    t.date "available_from"
    t.index ["animal_id"], name: "index_rescues_on_animal_id"
    t.index ["organization_id"], name: "index_rescues_on_organization_id"
    t.index ["receiving_user_id"], name: "index_rescues_on_receiving_user_id"
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

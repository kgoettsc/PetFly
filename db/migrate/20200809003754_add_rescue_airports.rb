class AddRescueAirports < ActiveRecord::Migration[6.0]
  def change
    create_table :rescue_airports do |t|
      t.uuid :uuid
      t.references :rescue
      t.references :airport
      t.string :type
      t.datetime :archived_at

      t.timestamps
    end
  end
end

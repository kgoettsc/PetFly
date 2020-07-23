class AddAirports < ActiveRecord::Migration[6.0]
  def change
    add_column :rescues, :from_airports, :string, array: true, default: []
    add_column :rescues, :to_airports, :string, array: true, default: []

    create_table :airports do |t|
      t.uuid :uuid
      t.string :name
      t.string :code
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end

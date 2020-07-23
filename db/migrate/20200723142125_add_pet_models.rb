class AddPetModels < ActiveRecord::Migration[6.0]
  def change
    create_table :locations do |t|
      t.uuid :uuid
      t.string :name
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
    create_table :organizations do |t|
      t.uuid :uuid
      t.string :name
      t.string :email
      t.float :latitude
      t.float :longitude

      t.timestamps
    end

    create_table :animals do |t|
      t.uuid :uuid
      t.string :name
      t.string :type
      t.string :info_url

      t.timestamps
    end

    create_table :rescues do |t|
      t.uuid :uuid
      t.references :organization
      t.references :animal
      t.references :receiving_user, references: :user
      t.references :from, references: :location
      t.references :to, references: :location

      t.timestamps
    end

    create_table :flights do |t|
      t.uuid :uuid
      t.string :number
      t.references :user
      t.boolean :can_transport

      t.timestamps
    end

    create_table :rescue_flights do |t|
      t.uuid :uuid
      t.references :rescue
      t.references :flight

      t.timestamps
    end
  end
end

class AddOrgMembers < ActiveRecord::Migration[6.0]
  def change
    add_column :organizations, :url, :string

    create_table :organization_users do |t|
      t.uuid :uuid
      t.references :organization
      t.references :user
      t.datetime :archived_at

      t.timestamps
    end
  end
end

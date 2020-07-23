Rails 6 Template


## Setting up app
1. Clone Repo
1. `bundle install`
1. `yarn install`
1. Change `database.yml` to suit your app's needs
1. `rake db:create`
1. `rake db:migrate`
1. `cp .env.copy .env`
1. Rename app in:
    * `application.rb`
    * `application.html.slim`

# Setting up auth
1. Create new creds in developer.google.com
1. Add new user
    * `User.create(email: 'you@here.com')`

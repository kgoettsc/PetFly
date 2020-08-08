Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'home#index'

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :destroy, :unauthorized]

  resources :home, only: [:index]

  resources :login, only: [:index]
  resources :user_auths, only: [:index]

  resources :airports, only: [:index]

  resources :organizations, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get :by_user
    end
  end

  resources :rescues, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get :active_by_user_organizations
      get :active_by_receiving_user
      get :active
    end
    member do
      get :matches
    end
  end

  resources :flights do
    collection do
      get :active_by_user
      get :search_by_number
    end
    member do
      get :matches
    end
  end

  resources :rescue_flights do
    collection do
      get :by_rescue_and_flights
      get :by_flight_and_rescues
      post :create_as_rescue
    end
  end

  get '*path', to: 'home#index'
end

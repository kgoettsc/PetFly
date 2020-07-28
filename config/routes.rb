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

  resources :organizations, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get :by_user
    end
  end

  resources :rescues, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get :active_by_user
    end
  end

  get '*path', to: 'home#index'
end

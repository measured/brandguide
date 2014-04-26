BMS::Application.routes.draw do
  devise_for :users

  constraints subdomain: /^admin$/ do
    namespace :admin, path: '/' do
      root 'brand_guides#index'

      resources :brand_guides, path: '/' do
        post :sort 
        resources :pages do
          resources :sections
        end
      end
    end
  end

  constraints subdomain: /^((?!www).).+$/ do
    resource :brand_guide, path: '/' do
      post :authenticate, on: :member
      get :logout, on: :member
      
      resources :pages, only: [:show]
      
      resources :asset_bundles do
        get :download, on: :member
        get :email, on: :member
      end
    end
  end

  root 'application#index'
end

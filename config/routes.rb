BMS::Application.routes.draw do
  devise_for :users

  # constraints subdomain: /.+/ do
  #   get '/', to: 'brand_guides#show'
  # end

  resources :brand_guides do
    resources :asset_groups do
      get :download, on: :member
    end
  end

  root 'application#index'

  namespace :admin do
    root 'brand_guides#index'

    resources :brand_guides do
      post :sort 
      resources :sections
    end
  end
end
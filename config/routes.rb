BMS::Application.routes.draw do
  devise_for :users

  root 'application#index'

  namespace :admin do
    root to: 'brand_guides#index'

    resources :brand_guides do
      resources :sections
    end
  end
end
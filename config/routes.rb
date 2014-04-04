BMS::Application.routes.draw do
  devise_for :users

  root 'application#index'

  namespace :admin do
    root to: 'admin#index'

    resources :brand_guides
  end
end
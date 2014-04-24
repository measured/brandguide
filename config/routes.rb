BMS::Application.routes.draw do
  devise_for :users

  constraints subdomain: /^admin$/ do
    namespace :admin, path: '/' do
      root 'brand_guides#index'

      resources :brand_guides, path: '/' do
        post :sort 
        resources :sections
      end
    end
  end

  constraints subdomain: /^((?!www).).+$/ do
    get '/', to: 'brand_guides#show', as: 'brand_guide'
    get '/asset_groups/:id/download', to: 'asset_groups#download', as: 'download_asset_group'
  end

  root 'application#index'
end
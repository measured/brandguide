BMS::Application.routes.draw do
constraints subdomain: /^admin$/ do
    devise_for :users
    
    namespace :admin, path: '/' do
      post '/user.json', to: 'users#create'
      post '/login.json', to: 'users#login'

      get '/guides.json', to: 'guides#index'
      get '/guides/:guide_id.json', to: 'guides#show'
      delete '/guides/:guide_id.json', to: 'guides#destroy'
      post '/guides.json', to: 'guides#create'
      post '/guides/:guide_id.json', to: 'guides#update'
      post '/guides/:guide_id/upload.json', to: 'guides#upload'

      root to: 'admin#index'

      get '/*path', to: 'admin#index'
    end
  end

  constraints subdomain: /^((?!www).).+$/ do
    resource :guide, path: '/' do
      post '/authenticate', to: 'guides#authenticate'
      get '/logout', to: 'guides#logout'

      get '/bundles/:key.json', to: 'asset_bundles#show'
      get '/bundles/:key/download.zip', to: 'asset_bundles#download'
      post '/bundles.json', to: 'asset_bundles#create'
    end
  end

  root 'application#index'
end

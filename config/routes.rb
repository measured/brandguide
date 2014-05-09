BMS::Application.routes.draw do
  devise_for :users

  constraints subdomain: /^admin$/ do
    namespace :admin, path: '/' do
      get '/current_user.json', to: 'users#show'
      get '/guides/:id.json', to: 'guides#show'
      post '/guides/:id/add_section.json', to: 'guides#add_section'
      post '/guides/:id/update_section.json', to: 'guides#update_section'
      post '/guides/:id/upload.json', to: 'guides#upload'

      root to: 'admin#index'
    end
    
    # namespace :admin, path: '/' do
    #   root 'guides#index'

    #   resources :guides, path: '/' do
    #     post :sort 
    #     resources :pages do
    #       resources :sections
    #     end
    #   end
    # end
  end

  constraints subdomain: /^((?!www).).+$/ do
    resource :guide, path: '/' do
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

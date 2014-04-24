class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index; end

  def after_sign_in_path_for(resource)
    admin_root_url(subdomain: 'admin')
  end
end
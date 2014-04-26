class BrandGuidesController < ApplicationController
  before_action :find_brand_guide, only: %w(login show)
  
  layout 'guide'

  def show; end

  def authenticate
    session[:password] = params[:brand_guide][:password]
    redirect_to root_path
  end

  def logout
    session[:password] = nil
    redirect_to root_path
  end

  private

  def authenticated?
    session[:password] == 'sekret'
  end

  helper_method :authenticated?

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(request.subdomain)
  end
end
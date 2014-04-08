class BrandGuidesController < ApplicationController
  layout 'guide'
  
  def show
    @brand_guide = BrandGuide.find_by_subdomain!(request.subdomain)
  end
end
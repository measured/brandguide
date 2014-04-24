class BrandGuidesController < ApplicationController
  layout 'guide'
  
  def show
    @brand_guide = BrandGuide.friendly.find(request.subdomain)
  end
end
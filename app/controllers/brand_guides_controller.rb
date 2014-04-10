class BrandGuidesController < ApplicationController
  layout 'guide'
  
  def show
    if request.subdomain.present?
      @brand_guide = BrandGuide.find_by_subdomain!(request.subdomain)
    else
      @brand_guide = BrandGuide.find(params[:id])
    end
  end
end
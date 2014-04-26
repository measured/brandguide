class BrandGuidesController < ApplicationController
  before_action :find_brand_guide, only: %w(show)
  
  layout 'guide'

  def show; end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(request.subdomain)
  end
end
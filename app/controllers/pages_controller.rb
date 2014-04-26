class PagesController < BrandGuidesController
  before_action :find_brand_guide
  before_action :find_page, only: [:show]

  layout 'guide'

  def show; end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(request.subdomain)
  end

  def find_page
    @page = @brand_guide.pages.friendly.find(params[:id])
  end
end
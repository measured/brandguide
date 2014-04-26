class PagesController < BrandGuidesController
  before_action :find_page, only: [:show]

  layout 'guide'

  def show; end

  private

  def find_page
    @page = @brand_guide.pages.friendly.find(params[:id])
  end
end
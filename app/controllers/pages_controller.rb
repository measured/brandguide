class PagesController < ApplicationController
  layout 'guide'

  def show
    @guide = find_guide
    @page = @guide.sections.roots.friendly.find(params[:id])
  end

  private

  def find_guide
    Guide.friendly.find(request.subdomain)
  end
end
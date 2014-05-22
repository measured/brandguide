class GuidesController < ApplicationController
  layout 'guide'

  def show
    @guide = find_guide
  end

  private

  def find_guide
    Guide.friendly.find(request.subdomain)
  end
end
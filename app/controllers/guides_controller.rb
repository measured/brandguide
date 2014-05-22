class GuidesController < ApplicationController
  def show
    @guide = find_guide

    render json: {
      status: :success,
      data: {
        guide: @guide.api_attributes
      }
    }
  end

  private

  def find_guide
    Guide.friendly.find(request.subdomain)
  end
end
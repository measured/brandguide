class AssetBundlesController < ApplicationController
  def show
    guide = find_guide
    bundle = guide.asset_bundles.friendly.find(params[:key])

    render json: {
      status: :success,
      data: {
        bundle: bundle.api_attributes
      }
    }
  end

  def download
    guide = find_guide
    bundle = guide.asset_bundles.friendly.find(params[:key])

    render json: {
      status: :success,
      data: {
        bundle: bundle.api_attributes
      }
    }
  end

  def create
    guide = find_guide

    assets = guide.assets.find(params[:asset_ids])
    bundle = guide.asset_bundles.create(assets: assets)

    render json: {
      status: :success,
      data: {
        bundle: bundle.api_attributes
      }
    }
  end

  private

  def find_guide
    Guide.friendly.find(request.subdomain)
  end
end
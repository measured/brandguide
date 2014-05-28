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

    zip_name = "#{guide.title.parameterize}-assets"
    tempfile = Tempfile.new("#{zip_name}--#{Time.now.to_i}")

    Zip::OutputStream.open(tempfile.path) do |zipfile|
      bundle.assets.each do |asset|
        zipfile.put_next_entry asset.file.name
        zipfile.print IO.read(asset.file.path)
      end
    end

    send_file tempfile.path, filename: zip_name, type: 'application/zip', disposition: :attachment
  end

  def create
    guide = find_guide

    assets = guide.assets.find(params[:asset_ids])
    bundle = guide.asset_bundles.create(assets: assets)

    if params[:recipients]
      email_params = {
        download_url: "http://#{request.host}/bundles/#{bundle.access_key}/download.zip",
        recipients: params[:recipients],
        message: params[:message]
      }

      BundleMailer.email(bundle, email_params).deliver
    end

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
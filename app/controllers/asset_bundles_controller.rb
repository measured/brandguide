class AssetBundlesController < ApplicationController
  before_action :find_brand_guide
  before_action :find_asset_bundle, only: %w(download email)
  
  def download
    zip_name = "#{@brand_guide.title.parameterize}-assets"
    tempfile = Tempfile.new("#{zip_name}--")

    Zip::OutputStream.open(tempfile.path) do |zipfile|
      @asset_bundle.assets.each do |asset|
        zipfile.put_next_entry asset.file.name
        zipfile.print IO.read(asset.file.path)
      end
    end

    send_file tempfile.path, type: 'application/zip', disposition: :attachment
  end

  def email
    email_params = {
      download_url: download_brand_guide_asset_bundle_url(@asset_bundle, subdomain: @brand_guide.slug, format: :zip),
      recipient: asset_bundle_params[:recipient],
      message: asset_bundle_params[:message]
    }

    AssetGroupMailer.email(email_params).deliver
  end

  def create
    @asset_bundle = AssetBundle.new(asset_bundle_params)
    @asset_bundle.brand_guide = @brand_guide

    @asset_bundle.save

    download_url = download_brand_guide_asset_bundle_url(@asset_bundle, subdomain: @brand_guide.slug, format: :zip)

    if asset_bundle_params[:recipient]
      email_params = asset_bundle_params
      email_params[:download_url] = download_url

      AssetBundleMailer.bundle_email(@asset_bundle, email_params).deliver

      render json: {
        message: 'Email sent'
      }
    else
      render json: {
        download_url: download_url
      }
    end
  end

  private

  def find_asset_bundle
    @asset_bundle = AssetBundle.friendly.find(params[:id])
  end

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(request.subdomain)
  end

  def asset_bundle_params
    params.require(:asset_bundle).permit(:recipient, :message, asset_ids: [])
  end
end
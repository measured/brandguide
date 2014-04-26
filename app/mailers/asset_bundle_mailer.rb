class AssetBundleMailer < ActionMailer::Base
  default from: 'hello@brandguide.io'

  def bundle_email(asset_bundle, params)
    @asset_bundle = asset_bundle
    @recipient = params[:recipient]
    @message = params[:message]
    @download_url = params[:download_url]

    mail(to: @recipient, subject: "#{asset_bundle.brand_guide.title} Assets")
  end
end
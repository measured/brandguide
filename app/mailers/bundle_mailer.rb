class BundleMailer < ActionMailer::Base
  default from: 'hello@brandguide.io'

  def email(bundle, params)
    @bundle = bundle
    @recipients = params[:recipients]
    @message = params[:message]
    @download_url = params[:download_url]

    mail(to: @recipients, subject: "#{bundle.guide.title} Assets")
  end
end
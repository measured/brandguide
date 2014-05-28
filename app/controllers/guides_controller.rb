class GuidesController < ApplicationController
  layout 'guide'
  helper_method :authenticated?

  def show
    @guide = find_guide
  end

  def authenticate
    session[auth_key] = params[:password]

    redirect_to '/'
  end

  def logout
    session[auth_key] = nil

    redirect_to '/'
  end

  private

  def auth_key
    "#{request.subdomain}_auth"
  end

  def find_guide
    Guide.friendly.find(request.subdomain)
  end

  def authenticated?
    if guide = find_guide
      if guide.password.present?
        session[auth_key] == guide.password
      else
        true
      end
    end
  end
end
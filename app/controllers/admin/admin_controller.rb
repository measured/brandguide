class Admin::AdminController < ApplicationController
  def index; end

  private

  def authenticate_from_token!
    if header_token = request.headers['X-User-Token']
      email, token = header_token.split(':')

      user = User.find_by_email(email)

      if user && Devise.secure_compare(user.authentication_token, token)
        sign_in user, store: false
      end
    end
  end
end
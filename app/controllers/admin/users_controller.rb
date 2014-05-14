class Admin::UsersController < Admin::AdminController
  def create
    user = User.create(user_params)

    render json: {
      status: :success,
      data: {
        user: user.api_attributes
      }
    }
  end

  def login
    user = User.find_by_email(user_params[:email])

    unless user.present?
      user = User.create(email: user_params[:email], password: user_params[:password], password_confirmation: user_params[:password])
    end

    if user.present? && user.valid_password?(user_params[:password])
      render json: {
        status: :success,
        data: {
          user: user.api_attributes
        }
      }
    else
      render json: {
        status: :error,
        message: 'Authentication failed, please try again.'
      }
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
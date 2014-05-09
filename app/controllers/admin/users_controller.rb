class Admin::UsersController < Admin::AdminController
  def show
    render json: {
      user: {
        id: current_user.id,
        email: current_user.email,
        gravatarUrl: current_user.gravatar_url
      }
    }
  end
end
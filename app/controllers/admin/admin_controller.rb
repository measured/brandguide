class Admin::AdminController < ApplicationController
  before_action :authenticate_user!

  before_action :slowdown

  private

  def slowdown
    sleep(rand(0..3)) if Rails.env.development? && request.method == 'POST'
  end
end
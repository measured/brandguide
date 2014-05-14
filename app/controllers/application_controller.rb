class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  before_action :slow

  def index; end

  private

  def slow
    # sleep(rand(0.0..1.0)) if Rails.env.development?
  end
end
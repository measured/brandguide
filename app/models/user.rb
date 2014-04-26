class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def gravatar_url
    "//gravatar.com/avatar/#{Digest::MD5.hexdigest(email)}"
  end
end

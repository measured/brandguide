class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  before_save :ensure_authentication_token

  has_many :guides

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def gravatar
    "http://gravatar.com/avatar/#{Digest::MD5.hexdigest(email)}"
  end

  def api_attributes
    {
      email: email,
      gravatar: gravatar,
      token: authentication_token,
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end

  private

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).present?
    end
  end
end
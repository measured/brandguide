class BrandGuide < ActiveRecord::Base
  validates :title, presence: true
  validates :subdomain, subdomain: true, uniqueness: { case_sensitive: false }

  before_validation :clean_subdomain

  has_many :sections
  accepts_nested_attributes_for :sections, allow_destroy: true

  def public_url
    if subdomain.present?
      "http://#{subdomain}.brandguide.io/"
    else
      "http://brandguide.io/#{id}"
    end
  end

  private

  def clean_subdomain
    self.subdomain = self.subdomain.parameterize
  end
end
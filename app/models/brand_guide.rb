class BrandGuide < ActiveRecord::Base
  validates :title, presence: true
  validates :subdomain, subdomain: true, uniqueness: { case_sensitive: false }

  before_validation :clean_subdomain

  has_many :sections, -> { order('row_order ASC') }, dependent: :destroy
  accepts_nested_attributes_for :sections, allow_destroy: true

  has_many :asset_groups, through: :sections

  before_create :add_default_sections

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

  def add_default_sections
    self.sections += Section.default_sections
  end
end
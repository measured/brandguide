class BrandGuide < ActiveRecord::Base
  extend FriendlyId

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  has_many :sections, dependent: :destroy
  accepts_nested_attributes_for :sections, allow_destroy: true

  has_many :pages

  has_many :asset_groups, through: :sections
  has_many :assets, through: :asset_groups

  has_many :asset_bundles

  friendly_id :title, use: :slugged

  def attributes_for_editor
    {
      id: id,
      slug: slug,
      title: title,
      pages: pages.map(&:attributes_for_editor)
    }
  end
end
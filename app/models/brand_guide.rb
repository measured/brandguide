class BrandGuide < ActiveRecord::Base
  extend FriendlyId

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  has_many :sections, -> { order('row_order ASC') }, dependent: :destroy
  accepts_nested_attributes_for :sections, allow_destroy: true

  has_many :asset_groups, through: :sections

  friendly_id :title, use: :slugged
end
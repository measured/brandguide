class Guide < ActiveRecord::Base
  extend FriendlyId

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  has_many :sections, dependent: :destroy
  accepts_nested_attributes_for :sections, allow_destroy: true

  has_many :pages

  has_many :asset_groups, through: :sections
  has_many :assets, through: :asset_groups

  has_many :asset_bundles

  belongs_to :user

  friendly_id :title, use: :slugged

  default_scope { order(created_at: :asc) }

  def api_attributes
    {
      id: id,
      slug: slug,
      title: (title || 'Untitled'),
      sections: sections.order('created_at asc').map(&:api_attributes),
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end
end
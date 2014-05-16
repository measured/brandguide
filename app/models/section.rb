class Section < ActiveRecord::Base
  extend FriendlyId

  belongs_to :guide, touch: true

  validates :title, presence: true

  has_ancestry

  has_many :asset_groups
  accepts_nested_attributes_for :asset_groups, allow_destroy: true

  attr_accessor :files

  friendly_id :title, use: :scoped, scope: :guide

  default_scope { order(created_at: :asc) }

  def content_html
    Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(content || '')
  end

  def api_attributes
    {
      id: id,
      slug: slug,
      title: title,
      content: content,
      asset_groups: asset_groups.map(&:api_attributes),
      ctime: created_at.to_i,
      mtime: updated_at.to_i
    }
  end
end
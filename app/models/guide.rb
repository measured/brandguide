class Guide < ActiveRecord::Base
  extend FriendlyId

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  has_many :sections, dependent: :destroy
  accepts_nested_attributes_for :sections, allow_destroy: true

  has_many :pages

  has_many :asset_groups, through: :sections
  has_many :colours, through: :sections
  has_many :assets, through: :asset_groups

  has_many :asset_bundles

  belongs_to :user

  friendly_id :title, use: :slugged

  default_scope { order(created_at: :asc) }

  def self.available_headers
    %w(huxtaburger bex hive)
  end

  def has_header?
    Guide.available_headers.include?(slug)
  end

  def header_path
    "headers/#{slug}.jpg" if has_header?
  end

  def content_html
    Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(content) if content.present?
  end

  def primary_colour
    colours.first.try(:rgb) || '#000000'
  end

  def secondary_colour
    colours.second.try(:rgb)
  end

  def api_attributes
    {
      id: id,
      slug: slug,
      title: (title || 'Untitled'),
      sections: sections.order('created_at asc').map(&:api_attributes),
      password: password,
      content: content,
      ctime: created_at.to_i,
      mtime: updated_at.to_i,
      primary: primary_colour,
      secondary: secondary_colour
    }
  end
end
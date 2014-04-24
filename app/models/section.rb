class Section < ActiveRecord::Base
  belongs_to :brand_guide

  validates_presence_of :title

  has_ancestry

  has_many :asset_groups
  accepts_nested_attributes_for :asset_groups, allow_destroy: true

  attr_accessor :files

  def content_html
    Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(content || '')
  end
end
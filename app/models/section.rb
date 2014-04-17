class Section < ActiveRecord::Base
  belongs_to :brand_guide

  validates_presence_of :title

  has_ancestry

  has_many :asset_groups
  accepts_nested_attributes_for :asset_groups

  attr_accessor :files

  include RankedModel
  ranks :row_order, with_same: :brand_guide_id

  def self.default_sections
    [
      { title: 'Introduction' },
      { title: 'Brand Assets' },
      { title: 'Colours' },
      { title: 'Usage' },
      { title: 'Clearspace' },
      { title: 'Typography' }
    ].collect do |attrs|
      Section.new(attrs)
    end
  end

  def content_html
    Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(content || '')
  end
end
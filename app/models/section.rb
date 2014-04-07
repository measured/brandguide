class Section < ActiveRecord::Base
  belongs_to :brand_guide

  validates_presence_of :title

  has_ancestry

  attr_accessor :files

  def self.default_sections
    [
      { title: 'Logos' },
      { title: 'Colours' },
      { title: 'Typography' },
      { title: 'Do\'s and don\'ts' }
    ].collect do |attrs|
      Section.new(attrs)
    end
  end

  def content_html
    Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(content || '')
  end
end
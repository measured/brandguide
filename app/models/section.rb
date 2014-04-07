class Section < ActiveRecord::Base
  belongs_to :brand_guide

  validates_presence_of :title

  has_ancestry

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
end
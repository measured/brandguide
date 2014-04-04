class Section < ActiveRecord::Base
  belongs_to :brand_guide

  validates_presence_of :title

  has_ancestry
end
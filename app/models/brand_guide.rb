class BrandGuide < ActiveRecord::Base
  validates_presence_of :title

  has_many :sections
end
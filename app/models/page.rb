class Page < Section
  extend FriendlyId

  friendly_id :title, use: :scoped, scope: :brand_guide
end
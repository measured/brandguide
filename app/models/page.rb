class Page < Section
  extend FriendlyId

  friendly_id :title, use: :scoped, scope: :brand_guide

  def attributes_for_editor
    {
      id: id,
      title: title,
      slug: slug,
      sections: children.map do |section| { 
        id: section.id,
        title: section.title,
        slug: section.slug
      } end
    }
  end
end
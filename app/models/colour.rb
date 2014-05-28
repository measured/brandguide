class Colour < ActiveRecord::Base
  belongs_to :section

  default_scope { order(created_at: :asc) }

  def api_attributes
    {
      id: id,
      title: title,
      ctime: created_at.to_i,
      mtime: updated_at.to_i,
      rgb: rgb,
      cmyk: cmyk,
      pantone: pantone
    }
  end
end
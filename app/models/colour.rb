class Colour < ActiveRecord::Base
  belongs_to :section

  def api_attributes
    {
      id: id,
      title: title,
      ctime: created_at.to_i,
      mtime: updated_at.to_i,
      display: display
    }
  end
end
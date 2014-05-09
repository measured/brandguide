class Admin::GuidesController < Admin::AdminController
  def show
    guide = find_guide    

    render json: {
      guide: {
        id: guide.id,
        slug: guide.slug,
        title: guide.title,
        sections: guide.sections.map do |section|
          {
            id: section.id,
            slug: section.slug,
            title: section.title,
            content: section.content,
            asset_groups: section.asset_groups.map do |group|
              {
                id: group.id,
                title: group.title,
                assets: group.assets.map do |asset|
                  {
                    name: asset.file.name
                  }
                end
              }
            end
          }
        end
      }
    }
  end

  def add_section
    guide = find_guide

    section = Section.create(title: params[:section][:title])
    guide.sections << section

    render json: {}
  end

  def update_section
    guide = find_guide

    section = guide.sections.find(params[:section][:id])

    section.update(
      title: params[:section][:title],
      content: params[:section][:content]
    )

    render json: {}
  end

  def upload
    guide = find_guide

    section = guide.sections.find(params[:section][:id])

    if files = params[:section][:files]
      asset_group = AssetGroup.new

      files.each do |file|
        asset = Asset.new
        asset.file = file

        asset.save!

        asset_group.assets << asset
      end

      section.asset_groups << asset_group
    end

    render json: {}
  end

  private

  def find_guide
    Guide.friendly.find(params[:id])
  end
end
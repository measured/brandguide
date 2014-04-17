class Admin::SectionsController < Admin::AdminController
  before_action :find_section, only: [:edit, :update]

  def edit; end

  def update
    if files = section_params[:files]
      asset_group = AssetGroup.new

      files.each do |file|
        asset = Asset.new
        asset.file = file

        asset.save!

        asset_group.assets << asset
      end

      @section.asset_groups << asset_group
    end

    if @section.update(section_params)
      redirect_to [:edit, :admin, @brand_guide, @section]
    else
      render :edit
    end
  end

  private

  def find_section
    @brand_guide = BrandGuide.find(params[:brand_guide_id])
    @section = @brand_guide.sections.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :content, asset_groups_attributes: [:id, :title, :_destroy], files: [])
  end
end
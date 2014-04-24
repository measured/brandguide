class Admin::SectionsController < Admin::AdminController
  before_action :find_brand_guide, only: [:new, :edit, :create, :update]
  before_action :find_section, only: [:edit, :update]

  def new
    @section = Section.new
  end

  def edit; end

  def create
    @section = Section.new(section_params)
    @section.brand_guide = @brand_guide

    if @section.save
      redirect_to edit_admin_brand_guide_path(@brand_guide)
    else
      render :new
    end
  end

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
      redirect_to edit_admin_brand_guide_section_path(@brand_guide, @section)
    else
      render :edit
    end
  end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(params[:brand_guide_id])
  end

  def find_section
    @section = @brand_guide.sections.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title, :parent_id, :content, asset_groups_attributes: [:id, :title, :_destroy], files: [])
  end
end
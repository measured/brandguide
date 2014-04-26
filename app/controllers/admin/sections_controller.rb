class Admin::SectionsController < Admin::AdminController
  before_action :find_brand_guide
  before_action :find_page
  before_action :find_section, only: [:edit, :update, :destroy]

  def new
    @section = Section.new
    @section.parent = @page
    @section.brand_guide = @brand_guide
  end

  def edit; end

  def create
    @section = Section.new(section_params)
    @section.parent = @page
    @section.brand_guide = @brand_guide

    upload_files

    if @section.save
      redirect_to edit_admin_brand_guide_path(@brand_guide)
    else
      render :new
    end
  end

  def update
    upload_files

    if @section.update(section_params)
      redirect_to edit_admin_brand_guide_page_section_path(@brand_guide, @page, @section)
    else
      render :edit
    end
  end

  def destroy
    @section.destroy

    redirect_to edit_admin_brand_guide_path(@brand_guide)
  end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(params[:brand_guide_id])
  end

  def find_page
    @page = @brand_guide.pages.friendly.find(params[:page_id])
  end

  def find_section
    @section = @brand_guide.sections.find(params[:id])
  end

  def upload_files
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
  end

  def section_params
    params.require(:section).permit(:title, :content, asset_groups_attributes: [:id, :title, :_destroy], files: [])
  end
end
class Admin::SectionsController < Admin::AdminController
  before_action :find_section, only: [:edit, :update]

  def edit; end

  def update
    if files = section_params[:files]
      files.each do |file|
        asset = Asset.new
        asset.upload = file

        asset.save!
      end
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
    params.require(:section).permit(:title, :content, files: [])
  end
end
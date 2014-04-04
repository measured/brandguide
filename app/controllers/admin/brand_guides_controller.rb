class Admin::BrandGuidesController < Admin::AdminController
  def index
    @brand_guides = BrandGuide.all
  end

  def new
    @brand_guide = BrandGuide.new
  end

  def create
    @brand_guide = BrandGuide.new(brand_guide_params)
    
    if @brand_guide.save
      redirect_to [:edit, :admin, @brand_guide]
    else
      render :new
    end
  end

  def edit
    @brand_guide = BrandGuide.find(params[:id])
    @brand_guide.sections.build
  end

  def update
    @brand_guide = BrandGuide.find(params[:id])

    if @brand_guide.update(brand_guide_params)
      redirect_to [:admin, :brand_guides]
    else
      render :edit
    end
  end

  private

  def brand_guide_params
    params.require(:brand_guide).permit(:title, :subdomain, sections_attributes: [:id, :title, :content, :_destroy])
  end
end
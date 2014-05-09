class Admin::BrandGuidesController < Admin::AdminController
  before_action :find_brand_guide, only: %w(show edit update destroy sort)

  def show
    render json: @brand_guide.attributes_for_editor
  end

  def index
    @brand_guides = BrandGuide.all.order('created_at desc')
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

  def edit; end

  def update
    render json: @brand_guide.update(brand_guide_params)
  end

  def destroy
    @brand_guide.destroy

    redirect_to [:admin, :brand_guides]
  end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(params[:id] || params[:brand_guide_id])
  end

  def brand_guide_params
    params.require(:brand_guide).permit(:title, :password, sections_attributes: [:id, :title, :content, :_destroy])
  end
end
class Admin::PagesController < Admin::AdminController
  before_action :find_brand_guide
  before_action :find_page, only: [:edit, :update, :destroy]

  def new
    @page = Page.new
    @page.brand_guide = @brand_guide
  end

  def edit; end

  def create
    @page = Page.new(page_params)
    @page.brand_guide = @brand_guide

    if @page.save
      redirect_to edit_admin_brand_guide_path(@brand_guide)
    else
      render :new
    end
  end

  def update
    if @page.update(page_params)
      redirect_to edit_admin_brand_guide_page_path(@brand_guide, @page)
    else
      render :edit
    end
  end

  def destroy
    @page.descendants.map(&:destroy)
    @page.destroy

    redirect_to edit_admin_brand_guide_path(@brand_guide)
  end

  private

  def find_brand_guide
    @brand_guide = BrandGuide.friendly.find(params[:brand_guide_id])
  end

  def find_page
    @page = @brand_guide.pages.friendly.find(params[:id])
  end

  def page_params
    params.require(:page).permit(:title, :content)
  end
end
class Admin::GuidesController < Admin::AdminController
  before_filter :authenticate_from_token!
  before_filter :authenticate_user!
  
  def index
    render json: {
      status: :success,
      data: {
        guides: current_user.guides.map(&:api_attributes)
      }
    }
  end

  def create
    if guide = current_user.guides.create(guide_params)
      render json: {
        status: :success,
        data: {
          guides: current_user.guides.map(&:api_attributes)
        }
      }
    else
      render json: {
        status: :fail,
        data: {}
      }
    end
  end

  def show
    guide = find_guide

    render json: {
      status: :success,
      data: {
        guide: guide.api_attributes
      }
    }
  end

  def update
    guide = find_guide

    guide.update(guide_params)

    render json: {
      status: :success,
      data: {
        guides: current_user.guides.map(&:api_attributes)
      }
    }
  end

  def upload
    guide = find_guide
    section = guide.sections.friendly.find(params[:section_id])
    
    asset_group = if params[:asset_group_id].present?
      section.asset_groups.find(params[:asset_group_id])
    else
      section.asset_groups.create
    end

    params[:assets].each do |asset|
      asset_group.assets.create(file: asset[:file])
    end

    render json: {
      status: :success,
      data: {
        guide: guide.api_attributes
      }
    }
  end

  private

  def find_guide
    current_user.guides.friendly.find(params[:guide_id])
  end

  def guide_params
    params.require(:guide).permit(
      :id, :slug, :title,
      sections_attributes: [
        :id, :slug, :title, :content, :_destroy, :parent_id,
        asset_groups_attributes: [:id, :title, :_destroy,
          assets_attributes: [:id, :_destroy]
        ],
        colours_attributes: [:id, :title, :hex, :_destroy]
      ]
    )
  end
end
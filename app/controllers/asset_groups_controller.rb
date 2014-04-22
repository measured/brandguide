class AssetGroupsController < ApplicationController
  def download
    @brand_guide = BrandGuide.find_by_subdomain!(request.subdomain)
    @asset_group = @brand_guide.asset_groups.find(params[:id])

    if params[:asset_ids].present?
      asset_ids = params[:asset_ids].split(',').map(&:to_i)
      assets = @asset_group.assets.find(asset_ids)
    else
      assets = @asset_group.assets
    end

    group_name = @asset_group.title.present? ? @asset_group.title : 'Assets'

    zip_name = [@asset_group.brand_guide.title, group_name]
    zip_name = zip_name.map(&:parameterize).join('_')

    tempfile = Tempfile.new("zipball-#{Time.now.to_i}")

    Zip::OutputStream.open(tempfile.path) do |zipfile|
      assets.each do |asset|
        zipfile.put_next_entry asset.file.name
        zipfile.print IO.read(asset.file.path)
      end
    end

    send_file tempfile.path, type: 'application/zip', disposition: :attachment, filename: zip_name
  end
end
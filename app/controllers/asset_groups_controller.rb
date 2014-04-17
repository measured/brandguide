class AssetGroupsController < ApplicationController
  def download
    # TODO: Check that the user has permission to download these assets
    # also, that the assets truly belong to that BrandGuide
    @asset_group = AssetGroup.find(params[:id])

    if params[:asset_ids]
      asset_ids = params[:asset_ids].split(',').map(&:to_i)
      assets = @asset_group.assets.find(asset_ids)
    else
      assets = @asset_group.assets
    end

    zip_name = [
      @asset_group.brand_guide.title,
      @asset_group.title || 'Assets'
      ].map(&:parameterize).join('--')

    tempfile = Tempfile.new("zipball-#{Time.now}")

    Zip::OutputStream.open(tempfile.path) do |zipfile|
      assets.each do |asset|
        zipfile.put_next_entry asset.file.name
        zipfile.print IO.read(asset.file.path)
      end
    end

    send_file tempfile.path, type: 'application/zip', disposition: :attachment, filename: zip_name
  end
end
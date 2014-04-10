class AssetGroupsController < ApplicationController
  def download
    # TODO: Check that the user has permission to download these assets
    # also, that the assets truly belong to that BrandGuide
    @asset_group = AssetGroup.find(params[:id])

    assets = asset_group_params[:assets_attributes].map do |n, param|
      @asset_group.assets.find(param[:id]) if param[:download] == '1'
    end

    assets.compact!

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

  private

  def asset_group_params
    params.require(:asset_group).permit(:id, assets_attributes: [:download, :id])
  end
end

# def download_all
# attachments = Upload.find(:all, :conditions => ["source_id = ?", params[:id]]) 

# zip_file_path = "#{RAILS_ROOT}/uploads/download_all.zip"


# # see if the file exists already, and if it does, delete it.
# if File.file?(zip_file_path)
# File.delete(zip_file_path)
# end


# # open or create the zip file
# Zip::ZipFile.open(zip_file_path, Zip::ZipFile::CREATE) { |zipfile|

# attachments.each do |attachment|
# #document_file_name shd contain filename with extension(.jpg, .csv etc) and url is the path of the document.
# zipfile.add( attachment.document_file_name, attachment.document.url) 

# end

# } 
# #send the file as an attachment to the user.
# send_file zip_file_path, :type => 'application/zip', :disposition => 'attachment', :filename => "download_all.zip"

# end
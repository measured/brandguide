require 'carrierwave/processing/mime_types'

class FileUploader < CarrierWave::Uploader::Base
  include CarrierWave::MimeTypes
  include CarrierWave::MiniMagick

  storage :file # :fog

  process :set_content_type
  process :save_content_type_and_size

  before :cache, :save_original_filename

  def store_dir
    "uploads"
  end

  def filename
    @name ||= "#{model.digest}.#{file.extension}"
  end

  def save_content_type_and_size
    model.content_type = file.content_type if file.content_type
    model.file_size = file.size
  end

  def save_original_filename(file)
    model.original_filename ||= file.original_filename if file.respond_to?(:original_filename)
  end

  version :small, if: :is_image? do
    process resize_to_fit: [360, 360]
  end

  version :medium, if: :is_image? do
    process resize_to_fit: [640, 640]
  end

  version :large, if: :is_image? do
    process resize_to_fit: [1280, 1280]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  # def extension_white_list
  #   %w(jpg jpeg gif png)
  # end

  private

  def is_image?(new_file)
    new_file.content_type.include?('image')
  end
end
class SubdomainValidator < ActiveModel::EachValidator  
  def validate_each(object, attribute, value)
    return unless value.present?

    reserved_names = %w(www ftp mail pop smtp admin ssl sftp)

    if reserved_names.include?(value)
      object.errors[attribute] << 'cannot be a reserved name'
    end

    object.errors[attribute] << 'must be between 3 and 63 characters' unless value.length.between?(3, 63)
    object.errors[attribute] << 'cannot start or end with a hyphen' unless value =~ /^[^-].*[^-]$/i
    object.errors[attribute] << 'must contain only alphanumeric characters' unless value =~ /^[a-z0-9\-]*$/i
  end
end
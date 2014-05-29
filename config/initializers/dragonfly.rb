require 'dragonfly'
require 'dragonfly/s3_data_store'

# Configure
Dragonfly.app.configure do
  plugin :imagemagick

  protect_from_dos_attacks true
  secret '7b922bcd75f757e34d63d17514f521740381e408bb655e48792ef041af9b33a4'

  url_format '/media/:job/:name'

  if Rails.env.production?
    datastore :s3,
      bucket_name: ENV['AWS_S3_BUCKET'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
      region: ENV['AWS_S3_REGION'],
      fog_storage_options: {
        path_style: true
      }

    define_url do |app, job, opts|
      thumb = Thumb.find_by_signature(job.signature)

      if thumb
        app.datastore.url_for(thumb.uid)
      else
        app.server.url_for(job)
      end
    end

    before_serve do |job, env|
      uid = job.store

      Thumb.create!(uid: uid, signature: job.signature)
    end
  else
    datastore :file,
      root_path: Rails.root.join('public/system/dragonfly', Rails.env),
      server_root: Rails.root.join('public')
  end
end

# Logger
Dragonfly.logger = Rails.logger

# Mount as middleware
Rails.application.middleware.use Dragonfly::Middleware

# Add model functionality
if defined?(ActiveRecord::Base)
  ActiveRecord::Base.extend Dragonfly::Model
  ActiveRecord::Base.extend Dragonfly::Model::Validations
end

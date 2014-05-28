namespace :assets do
  task :bundle do
    `RAILS_ENV=production bundle exec rake assets:precompile`
    `RAILS_ENV=production bundle exec rake assets:clean`
  end
end

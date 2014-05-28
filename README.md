bms
===

Brand Management System - it's basecamp for ya brand.

### v1.0 outcomes 

1. Better tool for scaffolding & deploying client brandguides
2. Sales brochure for sending to prospective clients


### Schedule

Sunday 6th April - Prototype for new server setup + functionality complete.

Sunday 27th April - Design work, example brandguides & brochure site complete.


### Who's it for?

The initial product is really just a nice to have deliverable for our branding clients & prospective clients. The app at this stage is _for us_, helping make our process more efficient and impressive to clients.


### Technology / functionality

Deployment:
- Single heroku server 
- deployed via git

Access:
- Brandguides on simple urls eg: `brand.brandguide.io`
- Login required to access each guide (password), OR…
- Login to account, access to multiple guides

Features:
- Download files + bundled zips
- Email a unique url to a file, or bundle of files
- Update text content via admin panel
- Upload files via admin panel


## Development

How to set up your local development environment, after cloning the repository.

1. `bundle`
2. `npm install`
3. `rake db:reset`
4. `rake assets:clobber`
5. `bundle exec guard`

If `pow` has been installed and linked (try `powder link`), the server will be running and accessible at `http://brandguide.dev/`.

### Possible errors

I had to install the pg gem manually with the following command, pretty sure it was a mavericks bug:

`gem install pg -- --with-pg-config=/Applications/Postgres.app/Contents/Versions/9.3/bin/pg_config`


## Production

First, add the Heroku remote repository

`git remote add heroku git@heroku.com:idealogue-bms.git`

Assets must be precompiled for Heroku depolyment. Run `rake assets:bundle` and then `git commit` the resulting files before pushing to Heroku.

When ready to push changes to the production site, just `git push heroku master`.

Don't pull from the heroku remote. Pull any code changes made by other collaborators from the github (`origin`) remote.

bms
===

Brand Management System - it's basecamp for ya brand.

### Outcomes 

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
- Brandguides on simple urls eg: `brandguide.io/brand`
- Login required to access each guide (password), OR…
- Login to account, access to multiple guides

Features:
- Download files + bundled zips
- Email a unique url to a file, or bundle of files
- Update text content via admin panel?
- Upload files via admin panel?


## Development

How to set up your local development environment, after cloning the repository.

1. `bundle install`
2. `rake db:create`
3. `bundle exec rake db:schema:load`
4. `bundle exec rerun foreman start`
5. `open http://localhost:5000`

## Production

First, add the Heroku remote repository

`git remote add heroku git@heroku.com:idealogue-bms.git`

When ready to push changes to the production site, just `git push heroku master`

Don't pull from the heroku remote. Pull any code changes made by other collaborators from the github (`origin`) remote.

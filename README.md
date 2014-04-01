bms
===

Brand Management System - it's basecamp for ya brand.

## Overview

A web based platform for creating and managing client brand projects.

Core features:
- Asset hosting and versioning
- Approval system
- Guidlines for brand rollout
- Presentation to stakeholders

Extended features / products:
- Copydeck (write copy and export data for use in websites/apps/print/etc.

Technology:
- Heroku rails app
- Sass & simple js front-end (display brand)
- react application? (complex user interface)

## Version Strategy

1. Local tool for deploying a new instance of the BMS (eg, on heroku).
2. Give clients access to a simple back-end for versioning assets.
3. Web based application for creating new BMS instances.

## Development

How to set up your local development environment, after cloning the repository.

1. `bundle install`
2. `rake db:schema:load`
3. `rails server`
4. `open http://localhost:3000`

## Production

First, add the Heroku remote repository

`git remote add heroku git@heroku.com:idealogue-bms.git`

When ready to push changes to the production site, just `git push heroku master`

Don't pull from the heroku remote. Pull any code changes made by other collaborators from the github (`origin`) remote.

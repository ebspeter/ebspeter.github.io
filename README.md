# ebspeter.github.io

## Evironments

### Production

Production is served on `http://forms.ebs.team` by github pages, production-transition is hosted on Web2 on `https://secforms.ebs.team`. 

All live instapage landingpages are getting the form by a client side script in the form embed code. The scripts use the local domain, ex: www.barschool.net, for ajax calls and track.ebs-platform.com for tracking.js and tracking ajax calls to piwik.php.

Deploying to production is done by simply push or merge to master, github will build the project. 

### Staging

Staging is served by the Phuket server on formstaging.ebs.team. 

All staged instapage landingpages are getting the form by a client side script in the form embed code. 

The scripts use the staging domain, ex: `staging.barschool.wpengine.com`, `www-bartenderskolan-com.barschool.wpengine.com`, for ajax calls and trackstaging.ebs-platform.com for tracking.js and tracking ajax calls to piwik.php.

Deploying to staging is done with flightplan, just copy flightplan.default.js to flightplan.js and update the needed variables `HOST, USER and KEY` with your details and run `fly staging`. 

### Localhost

With some host file modifications it's possible to test and debug the form on localhost, both production and staging build. More details will be added here at some point in the future. 

## Development workflow

To introduce new features, follow these steps: 
1. Develop the new functionality on localhost (on separate branch)
1. Push to origin
1. Merge to develop
1. Deploy to staging, `fly staging`
1. Copy an instapage affected by the change (instapage)
1. Move to Develop folder (instapage)
1. Copy the top embed code from `formstaging.ebs.team/{version}/{variation}/{market}/`, ex: `http://formstaging.ebs.team/v2/transparent/nl/`
1. Paste the embed code into the form
1. Publish the page to wp staging, `[www-subsite-tld.barschool.]barschool.staging.wpengine.com/lp/test`
1. Verify functionality, `[www-subsite-tld.barschool.]barschool.staging.wpengine.com/lp/test`. Tracking and Lead submit
1. Check that tracking is working by inspecting the visitor log in trackstaging.ebs-platform.com
1. Merge to master (this will also deploy the changes to production)
1. Verify the live page(s), including at least one page with is un-affected by the change (if any), are working as expected. Tracking and Lead submit
1. Monitor incoming leads volume during some time to catch any general issues. 

## Web2 Deploy
`JEKYLL_ENV=production jekyll build --config _config-production.yml`

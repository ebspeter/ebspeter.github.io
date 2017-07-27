# ebspeter.github.io

## Evironments

### Production

The production is served by github on `http://forms.ebs.team`. 

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
2. Merge to develop
2. Deploy to staging and verify functionality with an instapage published on staging.barschool.net
3. Check that tracking is working by inspecting the visitor log in trackstaging.ebs-platform.com
4. Merge to master
4. Verify the live page(s) are working as expected







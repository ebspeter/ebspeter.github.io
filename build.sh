#!/bin/bash

docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  -e JEKYLL_ENV=production \
  -it jekyll/jekyll \
  jekyll build --config _config-production.yml
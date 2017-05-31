var plan = require('flightplan');

// configuration
plan.target('staging', [
  {
    host: 'HOST',
    username: 'USER',
    privateKey: 'KEY_PATH',
    agent: process.env.SSH_AUTH_SOCK
  }
]);

plan.local(function(local) {
  // Local tasks here
});

plan.remote(function(remote) {
  remote.log('Pulling from github..');
  remote.exec('cd HOST/BASE_PATH && git pull GIT_REPOSITORY develop');

  remote.log('Build from source..');
  remote.exec('cd HOST/BASE_PATH && jekyll build');
});
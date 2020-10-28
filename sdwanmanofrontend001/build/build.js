'use strict';

var shell = require('shelljs');
var devopsArgv = JSON.parse(process.env.npm_config_argv).original;
var buildVersion = '';
var buildName = '';
var apiVersion = '';
var gatewayCtx = '';

devopsArgv.forEach(argv => {
  if (argv.indexOf('--buildVersion=') !== -1) {
    buildVersion = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--buildName=') !== -1) {
    buildName = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--apiVersion=') !== -1) {
    apiVersion = argv.substr(argv.indexOf('=') + 1);
  }
  if (argv.indexOf('--gatewayCtx=') !== -1) {
    gatewayCtx = argv.substr(argv.indexOf('=') + 1);
  }
});

if (!buildVersion) {
  shell.echo('Sorry, this script requires buildVersion');
  shell.exit(1);
}

if (!buildName) {
  shell.echo('Sorry, this script requires buildName');
  shell.exit(1);
}

if (!apiVersion) {
  shell.echo('Sorry, this script requires apiVersion');
  shell.exit(1);
}

if (!gatewayCtx) {
  shell.echo('Sorry, this script requires gatewayCtx');
  shell.exit(1);
}

var baseUrl = '/' + buildVersion + '/' + buildName;
var apiUrl = '/' + apiVersion + '/' + gatewayCtx;
var command =
  'cross-env VUE_APP_BASE_URL=' +
  baseUrl +
  ' VUE_APP_API_URL=' +
  apiUrl +
  ' vue-cli-service build --mode devops';

if (shell.exec(command).code !== 0) {
  shell.echo('Error: Devops build failed');
  shell.exit(1);
}

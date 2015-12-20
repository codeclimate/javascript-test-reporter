#!/usr/bin/env node

var Formatter = require('../formatter'),
  client = require('../http_client'),
  input = '',
  repo_token = process.env.CODECLIMATE_REPO_TOKEN;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  input += chunk;
});

if (!repo_token || repo_token.trim() === '') {
  console.error('No CODECLIMATE_REPO_TOKEN found. A CODECLIMATE_REPO_TOKEN must be specified as an environment variable.');
  process.exit(1);
}

process.stdin.on('end', function() {
  var formatter = new Formatter();
  formatter.format(input, function(err, json) {
    if (err) {
      console.error('A problem occurred parsing the lcov data', err);
    } else {
      if (process.env.CC_OUTPUT === 'stdout') {
        console.log(json);
      } else {
        json.repo_token = repo_token;
        client.postJson(json);
      }
    }
  });
});

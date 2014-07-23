#!/usr/bin/env node
var codeclimate = require('../lib');

process.stdin.resume();
process.stdin.setEncoding("utf8");

var input = "";

process.stdin.on("data", function(chunk) {
    input += chunk;
});

var repo_token = process.env.CODECLIMATE_REPO_TOKEN;

if(repo_token == undefined || repo_token.trim() == "") {
  console.error("No CODECLIMATE_REPO_TOKEN found. A CODECLIMATE_REPO_TOKEN must be specified as an environment variable.");
  process.exit(1);
}

process.stdin.on("end", function() {
  codeclimate(input, repo_token, /*{output: 'stdout'},*/ console.log);
});
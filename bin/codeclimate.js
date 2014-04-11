#!/usr/bin/env node

var Formatter = require("../formatter");
var client         = require('../http_client');

process.stdin.resume();
process.stdin.setEncoding("utf8");

var input = "";

process.stdin.on("data", function(chunk) {
    input += chunk;
});

process.stdin.on("end", function() {
  formatter = new Formatter()
  formatter.format(input, function(err, json) {
    if (err) {
      console.error("A problem occurred parsing the lcov data", err);
    } else {
      if (process.env.CC_OUTPUT == "stdout") {
        console.log(json);
      } else {
        json['repo_token'] = process.env.CODECLIMATE_REPO_TOKEN;
        client.postJson(json);
      }
    }
  });
});

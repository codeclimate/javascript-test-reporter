#!/usr/bin/env node

var codeclimate = require('../codeclimate');

process.stdin.resume();
process.stdin.setEncoding("utf8");

var input = "";

process.stdin.on("data", function(chunk) {
    input += chunk;
});

process.stdin.on("end", function() {
  codeclimate(input);
});

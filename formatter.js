var lcovParse = require('lcov-parse');
var path = require('path');
var fs = require('fs');
var pjson = require('./package.json');
var git  = require("./git_info");
var ci  = require("./ci_info");
var async = require("async");

function Formatter(options) {
  this.options = options || {};
}

Formatter.prototype.rootDirectory = function() {
  return this.options.rootDirectory || process.cwd();
}

Formatter.prototype.format = function(lcovData, callback) {
  var self = this;

  // Fix for absolute pathing in lscov.info data
  if(lcovData.indexOf(process.cwd())>-1){
    var pwdRegex = new RegExp(process.cwd(), 'gi');
    lcovData = lcovData.replace(pwdRegex, ".");
  }

  lcovParse(lcovData, function(parseError, data) {
    var result = {
      source_files: self.sourceFiles(data),
      run_at: Date.now(),
      partial: false,
      environment: {
        pwd: process.cwd(),
        package_version: pjson.version
      },
      ci_service: ci.getInfo()
    }
    async.parallel({
      head: git.head,
      branch: git.branch,
      committed_at: git.committedAt
    },
    function(err, results) {
      if (err) {
        console.error(err.message);
      }
      result.git = {
        head: results.head,
        branch: results.branch,
        committed_at: results.committed_at
      }
      return callback(parseError, result);
    });
  });
}

Formatter.prototype.sourceFiles = function(data) {
  var source_files = [];
  var self = this;
  data.forEach(function(elem, index) {
    var filepath = elem.file;
    if(self.options.rootDirectory){
      filepath = process.cwd()+'/'+
        self.options.rootDirectory.split('./')[1]+'/'+
        elem.file.split('./')[1];
    }
    var content = fs.readFileSync(filepath).toString();
    var numLines = content.split("\n").size

    var coverage = new Array(numLines);
    coverage.forEach(function(elem, index, arr) {
      arr[index] = null;
    });
    elem.lines.details.forEach(function(lineDetail) {
      coverage[lineDetail.line - 1] = lineDetail.hit
    });

    var fileName = path.relative(self.rootDirectory(), filepath);

    source_files.push({
      name: fileName,
      blob_id: git.calculateBlobId(content),
      coverage: JSON.stringify(coverage)
    });
  });
  return source_files;
}

module.exports = Formatter;

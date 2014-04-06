var assert = require("assert");
var fs = require('fs')
var Formatter = require('../formatter.js');

describe('JSON', function(){

  var lcovFixture = fs.readFileSync('test/fixtures/lcov.info').toString();
  var formatter = new Formatter({rootDirectory: "/Users/noah/p/request"});

  describe('parse', function() {
    it("should return the correct filenames", function(done) {
      formatter.format(lcovFixture, function(err, data) {
        var names = data.source_files.map(function(elem) {
          return elem.name;
        });
        expected = ["lib/cookies.js", "lib/copy.js"]
        assert.deepEqual(expected, names);
        done();
      });
    });
  });
})

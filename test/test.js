var assert = require("assert");
var fs = require('fs');
var Formatter = require('../lib/formatter.js');
var CiInfo = require('../lib/ci_info');
var lib = require('../lib');

describe('JSON', function(){
  var lcovFixture = fs.readFileSync('./test/fixtures/lcov.info').toString(),
      formatter = new Formatter(),
      expected = ["test/fixtures/lib/cookies.js", "test/fixtures/lib/copy.js"];

  lcovFixture = lcovFixture.replace(/\/Users\/noah\/p\/request\//g, __dirname + '/fixtures/');

  describe('parse', function() {
    it("should return the correct filenames", function(done) {
      formatter.format(lcovFixture, function(err, data) {
        assert(data.source_files.filter(function(elem, index) {
          return elem.name === expected[index];
        }));
        done();
      });
    });
});

describe('lib', function() {
    it("should return the correct filenames", function(done) {
      lib(lcovFixture, 'MY_PHONY_TOKEN', {output: 'callback'}, function(err, output) {
        assert(output.source_files.filter(function(elem, index) {
          return elem.name === expected[index];
        }));
        done();
      });
    });

    it("should return the correct error message", function(done) {
      lib(lcovFixture, 'MY_PHONY_TOKEN', function(err, output) {
        assert.equal('An invalid CODECLIMATE_REPO_TOKEN repo token was specified.', err);
        done();
      });
    });
  });
});

describe('ci_info', function() {
  describe('#getInfo', function() {
    var bupenv = Object.keys(process.env);

    afterEach(function(){
      for(var pk in process.env) {
        if (bupenv.indexOf(pk) < 0) {
          delete process.env[pk];
        }
      }
    });

    it('should return travis-ci as name if process.env.TRAVIS is set', function() {
      process.env.TRAVIS = 'true';

      var ci = CiInfo.getInfo();
      assert.equal(ci.name, 'travis-ci');
    });

    it('should return appveyor as name if process.env.APPVEYOR is set', function() {
      process.env.APPVEYOR = 'true';

      var ci = CiInfo.getInfo();
      assert.equal(ci.name, 'appveyor');
    });

  });
});

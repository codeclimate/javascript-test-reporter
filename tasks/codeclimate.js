var codeclimate = require('../codeclimate');
var fs          = require('fs');

module.exports = function(grunt) {
  grunt.registerMultiTask('codeclimate', 'Report Coverage with Code Climate', function() {
    var input = '';

    //TODO: support multiple lcov files.
    this.files.forEach(function(f) {
      if (f.src) {
        input = fs.readFileSync(f.src[0], 'utf8');
      }
    });

    codeclimate(input);
  });
};

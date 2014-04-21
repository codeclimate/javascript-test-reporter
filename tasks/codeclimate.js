var Formatter = require('../formatter');
var client    = require('../http_client');
var fs        = require('fs');

module.exports = function(grunt) {
  grunt.registerMultiTask('codeclimate', 'Report Coverage with Code Climate', function() {
    var input = '';
    
    //TODO: support multiple lcov files.
    this.files.forEach(function(f) {
      if (f.src) {
        input = fs.readFileSync(f.src[0], 'utf8');
      }
    });
    

    formatter = new Formatter();
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
};

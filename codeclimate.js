var Formatter = require('./formatter');
var client    = require('./http_client');

module.exports = function(input) {
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
};

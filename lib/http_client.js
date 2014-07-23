var request = require("request");
var url     = require("url");
var pjson   = require('../package.json');

var host = process.env.CODECLIMATE_API_HOST || "https://codeclimate.com"

var options = {
  url: host + "/test_reports",
  method: "POST",
  headers: {
    "User-Agent": "Code Climate (JavaScript Test Reporter v" + pjson.version + ")",
    "Content-Type": "application/json"
  },
  timeout: 5000
};

var postJson = function(data, callback) {

  parts = url.parse(options.url)

  options.body = JSON.stringify(data);
  request(options, function(error, response, body) {
    if (!error && response && response.statusCode == 401) {
      error = "An invalid CODECLIMATE_REPO_TOKEN repo token was specified.";
    }

    return callback(error, response.statusCode);
  });

}

module.exports = { postJson: postJson };
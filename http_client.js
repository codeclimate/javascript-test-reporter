var request = require("request");
var url     = require("url");
var pjson   = require('./package.json');

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

if (process.env.https_proxy) {
  options.proxy = process.env.https_proxy;
} else if (process.env.http_proxy) {
  options.proxy = process.env.http_proxy;
} else if (process.env.HTTPS_PROXY) {
  options.proxy = process.env.HTTPS_PROXY;
} else if (process.env.HTTP_PROXY) {
  options.proxy = process.env.HTTP_PROXY;
}

var postJson = function(data) {

  parts = url.parse(options.url)

  options.body = JSON.stringify(data);
  console.log("Sending test coverage results to " + parts.host + " ...");
  request(options, function(error, response, body) {
    if (error) {
      console.error("A problem occurred", error);
    }
    if (response) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log("Test coverage data sent.");
      } else if (response.statusCode == 401) {
        console.log("An invalid CODECLIMATE_REPO_TOKEN repo token was specified.")
      } else {
        console.log("Status code: " + response.statusCode);
      }
    }
  });

}

module.exports = { postJson: postJson };

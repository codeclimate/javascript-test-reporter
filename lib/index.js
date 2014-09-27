/*global require, console, module*/
var Formatter = require('./formatter'),
    client    = require('./http_client');

function process(lcov, token, options, callback) {

  var outputs = {}
  outputs.stdout = function(err, json, callback) {
    console.log(json);
    callback(err);
  },

  outputs.callback = function(err, json, callback) {
    callback(err, json);
  },

  outputs.default =
  outputs.codeclimate =
  outputs.undefined = function(err, json, callback) {
    if (err) {
      callback(err);
    } else {
      json.repo_token = token;
      client.postJson(json, callback);
    }
  }



  if(!callback && typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  options = options || {
    // default options;
  };

  var formatter = new Formatter();
  formatter.format(lcov, function(err, json) {
      if (options && outputs[options.output]) {
        outputs[options.output](err, json, callback);
      } else {
        throw 'Unknown output';
      }
  });
}

module.exports = process;
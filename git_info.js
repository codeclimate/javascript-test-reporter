var sh = require('execSync');
var crypto = require('crypto');

module.exports = {

  head: function() {
    return sh.exec("git log -1 --pretty=format:'%H'").stdout;
  },

  committedAt: function() {
    var timestamp = sh.exec("git log -1 --pretty=format:'%ct'").stdout;
    timestamp = parseInt(timestamp);
    if (isNaN(timestamp) || timestamp == 0) {
      return null;
    } else {
      return timestamp;
    }
  },

  branch: function() {
    var branches = sh.exec("git branch").stdout.split("\n");
    var returnBranch = null;
    branches.forEach(function(val) {
      if(val.charAt(0) == "*") {
        returnBranch = val;
      }
    });
    if (returnBranch) {
      return returnBranch.replace("* ", "")
    } else {
      return null;
    }
  },

  calculateBlobId: function(content) {
    var header  = 'blob ' + content.length + '\0';
    var store   = header + content;
    var shasum  = crypto.createHash('sha1');
    shasum.update(store);
    return shasum.digest("hex");
  }

}

//
// Quick-and-dirty, non-async Node.js wrapper for the unit tests.
//

/*global tests:true tv4:true */

var fs = require('fs')
  , path = require('path')
  ;

var enumDirs = function(targetDir) {
  var files = fs.readdirSync(targetDir);
  var dirs = files.filter(function(item) {
    var stats = fs.statSync(path.join(targetDir, item));
    return stats.isDirectory();
  });
  return dirs.map(function(dir) {
    return path.join(targetDir, dir);  // qualified path
  });
};

var enumJs = function(targetDir) {
  var files = fs.readdirSync(targetDir);
  var jsFiles = files.filter(function(file) {
    return path.extname(file) === '.js';
  });
  return jsFiles.map(function(file) {
    return path.join(targetDir, file);  // qualified path
  });
};

var dirs = enumDirs('./tests');
var jsFiles = dirs.map(enumJs);
jsFiles = Array.prototype.concat.apply([], jsFiles);  // flatten


var TestSet = function() {
  this.tests = [];
};
TestSet.prototype.add = function(desc, test) {
  this.tests.push([desc, test]);
};

tests = new TestSet();            // global, for test compatibility
tv4 = require('../tv4.js').tv4;   // global, for test compatibility

jsFiles.forEach(function(jsFile) {
  require('./' + jsFile);
});


var successCount = 0;

tests.tests.forEach(function(x) {
  x.assert = require('assert'); // support use of this.assert in tests
  try {
    var result = x[1]();
    if (!result) {
      console.log('FAIL:', x[0]);
    } else {
      successCount++;
    }
  } catch (e) {
    console.error('FAIL:', x[0]);
  }
});

console.log('***', successCount + '/' + tests.tests.length, 'tests passed');

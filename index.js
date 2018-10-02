var fs = require('fs');

var path = require('path');

var loadedModules = {};

var loadedExportObjs = {};

var loadedExportFuns = {};

var fileWatchers = {};

var options = {};

var oldExtFuns = {};

var RENodeModule = /^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/;

function setOptions(opts) {
  var curOpts = {
    extenstions: ['.js'],
    ignoreNodeModules: true,
    matchFn: null
  }
  if (opts && opts.extenstions) {
    if (Array.isArray(opts.extenstions)) {
      curOpts.extenstions = opts.extenstions;
    } else if (typeof opts.extenstions === 'string') {
      curOpts.extenstions = [opts.extenstions];
    }
  }
  if (opts && opts.ignoreNodeModules) curOpts.ignoreNodeModules = true;
  if (opts && typeof opts.matchFn === 'function') curOpts.matchFn = opts.matchFn;

  options = curOpts;
}

function match(filename, ext, matchFn, ignoreNodeModules) {
  if (typeof filename !== 'string') return false;
  if (ext.indexOf(path.extname(filename)) === -1) return false;

  var fullname = path.resolve(filename);
  if (ignoreNodeModules && RENodeModule.test(fullname)) return false;
  if (matchFn && typeof matchFn === 'function') return !!matchFn(fullname);
  return true;
}

function watchFile(filename) {
  var watcher = fs.watch(filename, { persistent: false }, function () {
    var loadedModule = loadedModules[filename];
    var parentModule = loadedModule.parent;
    var children = parentModule.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].id == filename) {
        children.splice(i, 1);
        break;
      }
    }
    var exports = parentModule.require(filename);
    var type = typeof exports;
    if (type === 'object') {
      Object.assign(loadedExportObjs[filename], exports);
    } else if (type === 'function') {
      loadedExportFuns[filename] = exports;
    }
  });
  fileWatchers[filename] = watcher;
}

function unWatchFiles() {
  for (var filename in fileWatchers) {
    fileWatchers[filename].close();
  }
}

function registerExtension(ext) {
  var oldExtFun = oldExtFuns[ext] || oldExtFuns['.js'];
  var matchFn = options.matchFn;
  var ignoreNodeModules = options.ignoreNodeModules;
  require.extensions[ext] = function (m, filename) {
    oldExtFun(m, filename);
    if (match(filename, ext, matchFn, ignoreNodeModules)) {
      delete require.cache[filename];
      if (!loadedModules[filename]) {
        loadedModules[filename] = m;
        var type = typeof m.exports;
        if (type === 'object') {
          loadedExportObjs[filename] = m.exports;
        } else if (type === 'function') { 
          loadedExportFuns[filename] = m.exports;
          //A function Wrapper should be used to hot replace exports Object
          m.exports = function () {
            var args = Array.prototype.slice.call(arguments);
            return loadedExportFuns[filename].apply(m, args);
          }
        }
      }
      if (!fileWatchers[filename]) {
        watchFile(filename);
      }
    }
  }
  return unWatchFiles;
}

function hotNodeModuleReplace(opts) {
  setOptions(opts);
  var exts = options.extenstions;
  exts.forEach(function (ext) {
    oldExtFuns[ext] = require.extensions[ext];
    registerExtension(ext);
  })
}

module.exports = hotNodeModuleReplace
/*jslint node: true */
'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var extend = require('extend');
var PluginError = gutil.PluginError;
// require('./pencil/marko');

// See https://github.com/tj/consolidate.js

// See https://github.com/kristianmandrup/jade-lexer

// var cons = require('consolidate');
// cons.swig('views/page.html', { user: 'tobi' }, function(err, html){
//   if (err) throw err;
//   console.log(html);
// });

function logger(opts) {
  return function(msg, obj) {
    if (opts.log) {
      console.log(msg, obj);
    }
  };
}

var defaultRootPath = '../../../';

function templateDirs(opts) {
  var dirs = opts.templateDirs;
  // var rootPath = (opts.rootPath || defaultRootPath);
  var resolved = {};
  for (var key of Object.keys(dirs)) {
    var templatePath = dirs[key];
    if (path.isAbsolute(templatePath)) {
      templatePath = path.relative(opts.filename, templatePath);
    }
    resolved[key] = templatePath;
  }
  return resolved;
}

// how to create custom gulp pipe function!?
module.exports = function(opts) {
  opts = opts || {};
  extend(opts, {doctype: 'html', pretty: true});

  // Using https://github.com/wearefractal/gulp-coffee/blob/master/index.js
  // As a blueprint ;)
  function compileJade(file, enc, cb) {
     // ignore empty files
     if (file.isNull()) {
       cb();
       return;
     }

     // we don't do streams (yet)
     if (file.isStream()) {
       this.emit('error', new PluginError('gulp-jade-markoa',  'Streaming not supported'));
       cb();
       return;
     }

     var log = logger(opts);
     log('options', opts);

     var jade = require('jade');
     // Compile the Jade template
     var locals = opts.locals || {};

     var rootPath = (opts.rootPath || defaultRootPath);
     var nodeModulesPath = path.join(rootPath, 'node_modules');

     opts.filename = file.path;
     var str = file.contents.toString('utf8');

     var resolvedTemplateDirs = templateDirs(opts);
     log('resolvedTemplateDirs', resolvedTemplateDirs);

     if (path.isAbsolute(nodeModulesPath)) {
       nodeModulesPath = path.relative(file.path, nodeModulesPath);
     }
     // nodeModulesPath = path.dirname(nodeModulesPath)
     if (nodeModulesPath[nodeModulesPath.length -1] !== '/') {
        nodeModulesPath += '/';
     }

     str = str.replace(/globalData/g, 'out.global');
     str = str.replace(/\spackage::/g, ' ' + nodeModulesPath);

     for (var key of Object.keys(resolvedTemplateDirs)) {
        var expr = new RegExp('\\s' + key + '::', 'g');
        str = str.replace(expr, ' ' + resolvedTemplateDirs[key] + '/');
     }

     var fn = jade.compile(str, opts);
     var html = fn(locals);

     // calculate path for Marko template using jade template file path
     var dir = path.dirname(file.path);
     var baseName = path.basename(file.path, '.jade');
     var markoFileName = [baseName, '.marko'].join('');
     var dest = path.join(dir, markoFileName);

     log('source', file.path);
     log('destination', dest);

     // Gulp Vinyl File adapters
     // See https://medium.com/@contrahacks/gulp-3828e8126466
     // See https://github.com/wearefractal/vinyl-fs
     file.path = dest;
     html = html.replace(/<xif/gi, '<if').replace(/xif>/gi, 'if>');
     html = html.replace(/<xelse/gi, '<else').replace(/xelse>/gi, 'else>');
     html = html.replace(/<xelse-if/gi, '<else-if').replace(/xelse-if>/gi, 'else-if>');
     html = html.replace(/<xvar/gi, '<var').replace(/xvar>/gi, 'var>');
     file.contents = new Buffer(html);
     cb(null, file);
   }

   return through.obj(compileJade);
};

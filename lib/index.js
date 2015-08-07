'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var fs = require('node-fs-extra');
var PluginError = gutil.PluginError;
var File = gutil.File;

// how to create custom gulp pipe function!?
module.exports = function(file, opts) {
  if (!file) {
    throw new PluginError('gulp-jade-markoa', 'Missing file option for gulp-jade-markoa');
  }
  opts = opts || {};

  var latestFile;
  var latestMod;
  var fileName;

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new PluginError('gulp-jade-markoa', 'Missing path in file options for gulp-jade-markoa');
  }

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

     // set latest file if not already set,
     // or if the current file was modified more recently.
     if (!latestMod || file.stat && file.stat.mtime > latestMod) {
       latestFile = file;
       latestMod = file.stat && file.stat.mtime;
     }

     var jade = require('jade');
     // Compile a function
     var fn = jade.compileFile(file, opts);
     var html = fn(locals);

     var dir = path.dirname(file);
     var baseName = path.basename(file, '.jade')
     var markoFileName = [baseName, '.marko'].join('');
     var markoTemplateFilePath = path.join(dir, markoFileName);

     // Gulp Vinyl File adapters
     // See https://medium.com/@contrahacks/gulp-3828e8126466
     // See https://github.com/wearefractal/vinyl-fs
     file.path = markoTemplateFilePath;

     var templateFile = new File(file);
     this.push(joinedFile);
     cb();
   }


   return through.obj(compileJade);
}

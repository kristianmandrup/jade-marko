'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var fs = require('node-fs-extra');
var extend = require('extend');
var PluginError = gutil.PluginError;
var File = gutil.File;
// require('./pencil/marko');

// See https://github.com/tj/consolidate.js

// See https://github.com/kristianmandrup/jade-lexer

// var cons = require('consolidate');
// cons.swig('views/page.html', { user: 'tobi' }, function(err, html){
//   if (err) throw err;
//   console.log(html);
// });

// how to create custom gulp pipe function!?
module.exports = function(opts) {
  opts = opts || {};
  extend(opts, {doctype: 'html', pretty: true})

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

     var jade = require('jade');
     // Compile the Jade template
     var locals = opts.locals || {};
     opts.filename = file.path;
     var str = file.contents.toString('utf8');
     var fn = jade.compile(str, opts);
     var html = fn(locals);

     // calculate path for Marko template using jade template file path
     var dir = path.dirname(file.path);
     var baseName = path.basename(file.path, '.jade')
     var markoFileName = [baseName, '.marko'].join('');
     var dest = path.join(dir, markoFileName);

     // Gulp Vinyl File adapters
     // See https://medium.com/@contrahacks/gulp-3828e8126466
     // See https://github.com/wearefractal/vinyl-fs
     file.path = dest;
     console.log('html', html);
     html = html.replace(/<xif/gi, '<if').replace(/xif>/gi, 'if>');
     html = html.replace(/<xelse/gi, '<else').replace(/xelse>/gi, 'else>')
     html = html.replace(/<xelse-if/gi, '<else-if').replace(/xelse-if>/gi, 'else-if>')
     html = html.replace(/<xvar/gi, '<var').replace(/xvar>/gi, 'var>')
     console.log('Marko html', html);
     file.contents = new Buffer(html)
     cb(null, file);
   }


   return through.obj(compileJade);
}

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var jadeMarko = require('./lib');

var options = {
  rootPath:  __dirname,
  log: true
};

gulp.task('jade:marko', function() {
  // custom jade compilation with Pencil using jade API
  gulp.src(['apps/**/*.jade'])
      .pipe(jadeMarko(options))
      .pipe(gulp.dest('./apps'));
});

// jshint files
gulp.task('jshint', function() {
    gulp.src(['test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('test', function() {
    gulp.src('test/**/*.js')
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('default', function() {
    gulp.run('jshint', 'test');
});

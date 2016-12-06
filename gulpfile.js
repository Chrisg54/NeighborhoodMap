/*eslint-env node */

var gulp = require('gulp'), watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var useref = require('gulp-useref');
var serve = require('gulp-serve');
var browserSync = require('browser-sync').create();

gulp.task('default', ['browserSync'], function() {

    gulp.watch("./src/css/*.css").on('change', browserSync.reload);
    gulp.watch("./src/js/*.js").on('change', browserSync.reload);
    gulp.watch("./src/*.html").on('change', browserSync.reload);

});

gulp.task('serve', serve('src'));

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './src'
    },
  })

  browserSync.stream(); 
})

gulp.task('dist', function() {
    gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./dist/css'));

    gulp.src('./src/img/*.*')
    .pipe(gulp.dest('./dist/img'));    

    gulp.src('./src/*.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist'));

    gulp.src('./src/js/main.js')
      .pipe(concat('main.js'))
      .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'-min.js'
          }
      }))
      .pipe(gulp.dest('dist/js')); 

    gulp.src('./src/js/knockout-3.4.1.js')
      .pipe(gulp.dest('dist/js')); 
});
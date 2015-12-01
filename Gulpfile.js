var gulp = require('gulp'),
    connect = require('gulp-connect'),
    del = require("del"),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache'),
    sort = require('gulp-sort'),
    source = require("vinyl-source-stream"),
    debowerify = require('debowerify'),
    browserify = require('browserify'),
    debug;

gulp.task('clean', function () {
  del.sync(['app/angular-templates.js', 'dist/**/*'])
})

gulp.task('build:assets', function () {
  return gulp.src('./app/assets/**/*')
             .pipe(gulp.dest('dist/assets/'))
})

gulp.task('build:template', function () {
  var stream = gulp.src('./app/components/**/*.html').pipe(sort())
             
  if (!debug)
    stream = stream.pipe(minifyHTML())
    
  return stream.pipe(templateCache('angular-templates.js', {
    module: 'templateCache',
    base: __dirname + '/app/',
    root: '',
    standalone: true
  })).pipe(gulp.dest('app/'))
})

gulp.task('build:html', function () {
  var stream = gulp.src('./app/index.html')
  
  if (!debug)
    stream = stream.pipe(minifyHTML())
  
  return stream.pipe(gulp.dest('dist/'))
})

gulp.task('build:bower', function () {
  return gulp.src('./app/bower_components/**/*')
            .pipe(gulp.dest("dist/bower_components/"))
})

gulp.task('build:js', function () {
  return browserify()
            .add("app/app.main.js")
            .transform(debowerify)
            .bundle()
            .pipe(source('app.main.js'))
            .pipe(gulp.dest("dist/"))
            .on('end', function() { del.sync('app/angular-templates.js') })
})

gulp.task('build', ['clean', 'build:assets', 'build:bower', 'build:template', 'build:html', 'build:js'])

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 80,
    livereload: true,
    fallback: 'dist/index.html'
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*'], ['build']);
});

gulp.task('debug', function() {
  debug = true
});

gulp.task('default', ['debug', 'build', 'connect', 'watch']);

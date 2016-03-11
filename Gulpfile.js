var gulp = require('gulp'),
    connect = require('gulp-connect'),
    del = require("del"),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache'),
    sort = require('gulp-sort'),
    source = require('vinyl-source-stream'),
    debowerify = require('debowerify'),
    browserify = require('browserify'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    uglifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    buffer = require('vinyl-buffer'),
    htmlreplace = require('gulp-html-replace'),
    version = require('yargs').argv['build'] || '0.0.1-dev',
    debug;

gulp.task('clean', function () {
  del.sync(['app/angular-templates.js', 'dist/**/*'])
})

gulp.task('build:assets', function () {
  return gulp.src(['./app/assets/**/*'])
             .pipe(gulp.dest('dist/assets/'))
})

gulp.task('build:template', function () {
  var stream = gulp.src(['./app/components/**/*.html', './app/directives/**/*.html']).pipe(sort())
             
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
  var stream = gulp.src('./app/index.html').pipe(htmlreplace({
    js: '/' + version + '/app.main.js',
    css: '/' + version + '/app.main.css'
  }));
  
  if (!debug)
    stream = stream.pipe(minifyHTML())
  
  return stream.pipe(gulp.dest('dist/' + version + '/')).pipe(gulp.dest('dist/'))
})

gulp.task('build:css', function () {
  var stream = gulp.src([
    './app/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
    './app/bower_components/ui-select/dist/select.css',
    './app/bower_components/seiyria-bootstrap-slider/css/bootstrap-slider.css',
    './app/bower_components/angular-toastr/dist/angular-toastr.css',
    './app/bower_components/ng-img-crop-full-extended/compile/minified/ng-img-crop.css',
    './app/css/*.css'
  ]).pipe(concat('app.main.css'))
  
  if (!debug)
    stream = stream.pipe(uglifyCss({ keepSpecialComments: 0 }))
    
  return stream.pipe(gulp.dest('dist/' + version + '/'))
})

gulp.task('build:js', ['build:template'], function () {
  var stream = browserify().add("app/app.main.js")
    .transform(debowerify)
    .bundle()
    .pipe(source('app.main.js'))
  
  if (!debug)
    stream = stream.pipe(buffer()).pipe(ngAnnotate()).pipe(uglify())
    
  return stream.pipe(gulp.dest('dist/' + version + '/'))
            .on('end', function() { del.sync('app/angular-templates.js') })
})

gulp.task('build', ['clean', 'build:assets', 'build:html', 'build:js', 'build:css'])

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 80,
    //livereload: true,
    fallback: 'dist/index.html'
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*'], ['build:html', 'build:js', 'build:css']);
});

gulp.task('debug', function() {
  debug = true
});

gulp.task('default', ['debug', 'build', 'connect', 'watch']);


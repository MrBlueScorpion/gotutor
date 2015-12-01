var gulp = require('gulp'),
    connect = require('gulp-connect'),
    del = require("del"),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache'),
    sort = require('gulp-sort'),
    source = require("vinyl-source-stream"),
    debowerify = require('debowerify'),
    browserify = require('browserify');

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 80,
    livereload: true,
    fallback: 'app/index.html'
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);

gulp.task('clean', function () {
  del.sync('dist/**/*')
})

gulp.task('build:assets', function () {
  return gulp.src('./app/assets/**/*')
             .pipe(gulp.dest('dist/assets/'))
})

gulp.task('build:template', function () {
  return gulp.src('./app/components/**/*.html')
             .pipe(sort())
             .pipe(minifyHTML())
             .pipe(templateCache('angular-templates.js', {
                module: 'gotute.components.templateCache',
                base: __dirname + '/app/',
                root: ''
             }))
             .pipe(gulp.dest('dist/'))
})

gulp.task('build:html', function () {
  return gulp.src('./app/index.html')
             .pipe(minifyHTML())
             .pipe(gulp.dest('dist/'))
})

gulp.task('build:js', function () {
  return browserify()
            .add("app/app.main.js")
            .transform(debowerify)
            .bundle()
            .pipe(source('app.main.js'))
            .pipe(gulp.dest("dist/"))
})

gulp.task('build', ['clean', 'build:assets', 'build:template', 'build:html', 'build:js'])
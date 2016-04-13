"use strict";

var path = require('path');

var gulp            = require('gulp'),
    angularFilesort = require('gulp-angular-filesort'),
    bower           = require('gulp-bower'),
    concat          = require('gulp-concat'),
    debug           = require('gulp-debug'),
    del             = require('del'),
    gif             = require('gulp-if'),
    inject          = require('gulp-inject'),
    mainBowerFiles  = require('main-bower-files'),
    minifyCss       = require('gulp-minify-css'),
    order           = require("gulp-order"),
    rename          = require('gulp-rename'),
    runSequence     = require('run-sequence'),
    sourcemaps      = require('gulp-sourcemaps'),
    templateCache   = require('gulp-angular-templatecache'),
    uglify          = require('gulp-uglify'),
    gutil           = require('gulp-util');

var pjson = require('./package.json');

/**
 * Cleans contents of build/
 */
gulp.task('clean', function() {
    return del(['build']);
});

/**
 * JS tasks. Bower components go into build/scripts/vendor.min.js
 * and all other files go into build/scripts/local.min.js.
 * If rc or prod, scripts are minified.
 */
gulp.task('js', ['js:local', 'js:vendor']);

gulp.task('js:local', function() {
    return gulp.src(['client/app/**/*.js'])
    .pipe(order([
        "demo.js",
        "auth/auth.js"
    ]))
    .pipe(debug({title: 'local scripts:'}))
    .pipe(sourcemaps.init())
    .pipe(concat('local.min.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '-' + pjson.version}))
    .pipe(sourcemaps.write('../'))
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('js:vendor', function() {
    return gulp.src(mainBowerFiles({filter: (/.*\.(js)/i), read: false}))
    .pipe(angularFilesort())
    .pipe(order([
        "lodash.js",
        "jquery.js",
        "angular.js",
        "angular-*.js"
    ]))
    .pipe(debug({title: 'vendor scripts:'}))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '-' + pjson.version}))
    .pipe(sourcemaps.write('../'))
    .pipe(gulp.dest('build/scripts'));
});

/**
 * Stuff that makes the site pretty
 */
gulp.task('css', ['css:local', 'css:vendor']);

gulp.task('css:local', function() {
    return gulp.src('client/app/**/*.css')
    .pipe(debug({title: 'local styles:'}))
    .pipe(sourcemaps.init())
    .pipe(concat('local.min.css'))
    .pipe(minifyCss({processImport: false}))
    .pipe(rename({suffix: '-' + pjson.version}))
    .pipe(sourcemaps.write('../'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('css:vendor', function() {
    return gulp.src(mainBowerFiles({filter: (/.*\.(css)/i), read: false}))
    .pipe(debug({title: 'vendor styles:'}))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.min.css'))
    .pipe(minifyCss({processImport: false}))
    .pipe(rename({suffix: '-' + pjson.version}))
    .pipe(sourcemaps.write('../'))
    .pipe(gulp.dest('build/css'));
});

/**
 * Font Awesome
 */
gulp.task('fonts', function() {
    return gulp.src(mainBowerFiles({filter: (/.*\.(eot|otf|woff|woff2|svg|ttf)/i)}))
    .pipe(gulp.dest('build/fonts'));
});

/**
 * Images
 */
gulp.task('images', function() {
    var images = ['client/assets/img/**/*.*'].concat(mainBowerFiles({filter: (/.*\.(png|jpg|gif)/i)}));
    return gulp.src(images)
    .pipe(gulp.dest('build/img'));
});

/**
 * Compile templates into $templateCache
 */
gulp.task('templates', function() {
    return gulp.src(['!client/app/demo.html', 'client/app/**/*.html'])
    .pipe(debug({title: 'templates:'}))
    .pipe(templateCache({module: 'demo.templates', standalone: true}))
    .pipe(rename({suffix: '-' + pjson.version}))
    .pipe(gulp.dest('build/scripts'));
});

/**
 * Inject everything into HTML and produce index.html
 */
gulp.task('html', function() {
    var local = gulp.src([
        path.join('build/css/local*.css'),
        path.join('build/scripts/local*.js'),
        path.join('build/scripts/templates*.js')
    ], {read: false});
    var vendor = gulp.src([
        path.join('build/css/vendor*.css'),
        path.join('build/scripts/vendor*.js')
    ], {read: false});

    return gulp.src('client/app/demo.html')
    .pipe(inject(local, {name: 'local', ignorePath: 'build'}))
    .pipe(inject(vendor, {name: 'vendor', ignorePath: 'build'}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build'));
});

gulp.task('default', function(done) {
    runSequence('clean', 'js', 'css', 'fonts', 'images', 'templates', 'html', done);
});

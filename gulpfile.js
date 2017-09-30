"use strict";

let gulp = require('gulp'),
    rename = require("gulp-rename"),
    browserify = require("browserify"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    minify = require('gulp-babel-minify'),
    jsdoc = require('gulp-jsdoc3'),
    SRC_DIR = './src/',
    EXPORT_DIR = './dist/',
    NAME = 'ke-fullscreen',
    ORDER = 'package',
    DEV = '-dev',
    PROD = process.argv.indexOf(ORDER + DEV) >= 0;

if (PROD) {
    ORDER += DEV;
    EXPORT_DIR = './build/';
}

function doBabelify(b, isES6) {
    !isES6 && (b = b.transform("babelify", {presets: ["es2015"]}));
    return b;
}

function createSourceMap(b) {
    PROD && (b = b.pipe(sourcemaps.init({loadMaps: true})).pipe(sourcemaps.write(".")));
    return b;
}

function doMinify(suffix) {
    !PROD && gulp.src(require.resolve(EXPORT_DIR + NAME + suffix + '.js'))
        .pipe(rename(NAME + suffix + '.min.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest(EXPORT_DIR));
}

function doBuild(suffix) {
    let b = browserify({
        entries: SRC_DIR + "core.js",
        standalone: 'fullscreen',
        debug: PROD
    });
    b = doBabelify(b, suffix).bundle()
        .pipe(source(NAME + suffix + ".js"))
        .pipe(buffer());
    return createSourceMap(b).pipe(gulp.dest(EXPORT_DIR).on('end', () => {
        doMinify(suffix);
    }));
}

gulp.task("build", () => {
    doBuild('');
    return doBuild('-es6');
});

gulp.task('doc', (cb) => {
    let config = require('./jsdoc.json');
    gulp.src(['README.md', SRC_DIR + 'fullscreen.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('watch', () => {
    gulp.watch([SRC_DIR + '**/*.js'], ['build']);
});

gulp.task(ORDER, () => {
    gulp.start('build', 'watch');
});
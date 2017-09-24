"use strict";

let gulp = require('gulp'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    browserify = require("browserify"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    jsdoc = require('gulp-jsdoc3'),
    SRC_DIR = './src/',
    EXPORT_DIR = './dist/',
    NAME = 'ke-fullscreen',
    ORDER = 'package',
    DEV = '-dev',
    DOC = '-doc',
    PROD = process.argv.indexOf(ORDER + DEV) >= 0,
    JSDOC = process.argv.indexOf(ORDER + DOC) >= 0;

if (PROD) {
    ORDER += DEV;
    EXPORT_DIR = './build/';
}

gulp.task("build", () => {
    let b = browserify({
        entries: SRC_DIR + "fullscreen.js",
        standalone:'Fullscreen',
        debug: PROD
    }).transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source(NAME + ".js"))
        .pipe(buffer());
    PROD && (b = b.pipe(sourcemaps.init({loadMaps: true})).pipe(sourcemaps.write(".")));
    return b.pipe(gulp.dest(EXPORT_DIR).on('end', () => {
        !PROD && gulp.src(require.resolve(EXPORT_DIR + NAME + '.js'))
            .pipe(rename(NAME + '.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(EXPORT_DIR));
    }));
});

gulp.task('doc', (cb)=> {
    var config = require('./config-doc.json');
    gulp.src([SRC_DIR + 'fullscreen.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('watch', () => {
    gulp.watch([SRC_DIR + '**/*.js'], ['build']);
});

gulp.task(ORDER, () => {
    gulp.start('build', 'watch');
});
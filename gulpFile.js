/**
 * Created by paul.watkinson on 06/05/2016.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const babel = require('gulp-babel');
const strip = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');

const SOURCE_ROOT = './src';
const OUTPUT_ROOT = './bin';

const PATHS = {
    'es6': {
        'src': path.join(SOURCE_ROOT, '/**/*.es6'),
        'bin': path.join(OUTPUT_ROOT)
    },

    'js': {
        'src': path.join(SOURCE_ROOT, '/**/*.js'),
        'bin': path.join(OUTPUT_ROOT)
    },

    'json': {
        'src': path.join(SOURCE_ROOT, '/**/*.json'),
        'bin': path.join(OUTPUT_ROOT)
    }
};

gulp.task('clean:bin', () => {
    return del([OUTPUT_ROOT + '/**/*'], { 'force': true });
});

gulp.task('compile:es6', ['clean:bin'], () => {
    return gulp.src(PATHS.es6.src)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.es6.bin));
});

gulp.task('compile:all', ['compile:es6'], () => {});

gulp.task('copy:js', ['clean:bin'], () => {
    return gulp.src(PATHS.js.src)
        .pipe(gulp.dest(PATHS.js.bin));
});

gulp.task('copy:json', ['clean:bin'], () => {
    return gulp.src(PATHS.json.src)
        .pipe(strip())
        .pipe(gulp.dest(PATHS.json.bin));
});

gulp.task('copy:all', ['copy:js', 'copy:json'], () => {});

gulp.task('build', ['compile:all', 'copy:all'], () => {});

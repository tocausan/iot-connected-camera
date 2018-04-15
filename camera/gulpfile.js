'use strict';

const gulp = require('gulp'),
    ignore = require('gulp-ignore'),
    refresh = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    minifyCSS = require('gulp-minify-css'),
    tsProject = require("gulp-typescript").createProject("tsconfig.json");

const path = {
    src: 'src',
    build: 'build'
};

// complile typescript
gulp.task('compile', () => {
    // TS
    gulp.src(path.src + '/**/*.ts')
        .pipe(tsProject())
        .js
        .pipe(gulp.dest(path.build))
        .pipe(refresh(server));

    // JS
    gulp.src(path.src + '/**/*.js')
        .pipe(gulp.dest(path.build))
        .pipe(refresh(server));
});

// public style
gulp.task('style', () => {
    // CSS
    gulp.src([path.src + '/**/*.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest(path.build))
        .pipe(refresh(server));
});

// views template
gulp.task('template', () => {
    gulp.src([path.src + '/**/*.html', path.src + '/**/*.ejs'])
        .pipe(gulp.dest(path.build))
        .pipe(refresh(server));
});

gulp.task('media', () => {
    gulp.src([path.src + '/**/*.jpg', path.src + '/**/*.png'])
        .pipe(gulp.dest(path.build));
});

gulp.task('default', ['compile', 'template', 'style', 'media'], () => {

    gulp.watch(path.src + '/**', () => {
        gulp.run('compile');
        gulp.run('template');
        gulp.run('style');
        gulp.run('media');
    });
});

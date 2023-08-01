const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

/* FUNCTIONS WATCH, COMPILE SASS, ... */
function compileSass() {
    return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,    
    }))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('css/'));
}

function pluginsCSS() {
    return gulp.src('css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream())
}

function gulpJs() {
    return gulp.src('javascript/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(uglify())
    .pipe(gulp.dest('javascript/'))
    .pipe(browserSync.stream())
}

function pluginsJs() {
    return gulp
    .src(['./javascript/lib/aos.min.js','./javascript/lib/swiper.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('javascript/'))
    .pipe(browserSync.stream());
}

function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}

/* BROWSER RELOAD AND WATCH */
function watch() {
    gulp.watch('scss/*.scss', compileSass);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('javascript/scripts/*.js', gulpJs); // CORRECTED PATH
    gulp.watch('javascript/lib/*.js', pluginsJs);
    gulp.watch('css/lib/*.css', pluginsCSS);
}

/* TASKS */
gulp.task('pluginscss', pluginsCSS);
gulp.task('pluginsjs', pluginsJs);
gulp.task('alljs', gulpJs);
gulp.task('sass', compileSass);
gulp.task('browser-sync', browser);
gulp.task('watch', watch);
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'alljs', 'pluginsjs', 'pluginscss'));

var gulp = require('gulp');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mq4HoverShim = require('mq4-hover-shim');
var del = require('del');
var browser = require('browser-sync');
var panini = require('panini');
var concat = require('gulp-concat');
var port = process.env.SERVER_PORT || 8080;
var nodepath =  'node_modules/';

// Watch files for changes
function watch() {
    gulp.watch('scss/**/*', gulp.series(compileScss, browser.reload));
    gulp.watch('sass/**/*', gulp.series(compileSass, browser.reload));
    gulp.watch('js/**/*', gulp.series(copyJs, browser.reload));
    gulp.watch('html/pages/**/*', compileHtml);
    gulp.watch('images/**/*', gulp.series(copyImages, browser.reload));
    gulp.watch(['html/{layouts,includes,helpers,data}/**/*'], gulp.series(compileHtmlReset, compileHtml));
    gulp.watch(['./src/{layouts,partials,helpers,data}/**/*'], panini.refresh);
};

// Erases the dist folder
function reset() {
    return el(['bulma/*', 'scss/*', 'assets/css/*', 'assets/fonts/*', 'images/*']);
};
exports.reset = reset;

// Erases the dist folder
function clean() {
    return del('_site');
};

// Copy Bulma filed into Bulma development folder
function setupBulma() {
    //Get Bulma from node modules
    const a = gulp.src([nodepath + 'bulma/*.sass']).pipe(gulp.dest('bulma/'));
    const b = gulp.src([nodepath + 'bulma/**/*.sass']).pipe(gulp.dest('bulma/'));
    return merge(a, b);
};

// Copy assets
function copy() {
    //Copy other external css assets
    const a = gulp.src(['assets/css/*.css']).pipe(gulp.dest('_site/assets/css/'));
    //Copy other external font assets
    const b = gulp.src(['assets/fonts/*']).pipe(gulp.dest('_site/assets/fonts/'));
    return merge(a, b);
};

//Theme Sass variables
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [nodepath + 'bulma/sass']
};

//Theme Scss variables
var scssOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: ['./scss/partials']
};

// Compile Bulma Sass
function compileSass () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer()//,
        //cssnano(),
    ];
    //Watch me get Sassy
    return gulp.src('./bulma/bulma.sass')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
};

// Compile Theme Scss
function compileScss() {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer()//,
        //cssnano(),
    ];
    //Watch me get Sassy
    return gulp.src('./scss/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
};

// Compile Html
function compileHtml() {
    return gulp.src('html/pages/**/*.html')
        .pipe(panini({
        root: 'html/pages/',
        layouts: 'html/layouts/',
        partials: 'html/includes/',
        helpers: 'html/helpers/',
        data: 'html/data/'
    }))
        .pipe(gulp.dest('_site'))
        .on('finish', browser.reload);
};

function compileHtmlReset(done) {
    panini.refresh();
    done();
};

// Compile js from node modules
function compileJs() {
    return gulp.src([ 
        nodepath + 'jquery/dist/jquery.min.js', 
        nodepath + 'feather-icons/dist/feather.min.js',
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./_site/assets/js/'));
};

//Copy Theme js to production site
function copyJs() {
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('./_site/assets/js/'));
};

//Copy images to production site
function copyImages() {
    return gulp.src('images/**/*')
        .pipe(gulp.dest('./_site/assets/images/'));
};

exports.init = setupBulma;

const build = gulp.series(clean, copy, compileJs, copyJs, compileSass, compileScss, compileHtml, copyImages);
exports.build = build;

// Starts a BrowerSync instance
const server = gulp.series(build, function(){
    browser.init({server: './_site', port: port});
});
exports.server = server;

exports.default = gulp.parallel(server, watch);

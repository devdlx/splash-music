var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

function compile(watch) {
    var bundler = watchify(browserify('./index.es6', {
        debug: true
    }).transform("babelify", {
        presets: ["es2015"]
    }));

    bundler.add('src/dlx-firebase/dlx-firebase.es6');
    bundler.add('src/dlx-firebase/dlx-firebase.es6');
    bundler.add('./src/dlx-video/dlx-video.es6');

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('index.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
};

gulp.task('build', function() {
    return compile();
});
gulp.task('watch', function() {
    return watch();
});

gulp.task('default', ['watch']);

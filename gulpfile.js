var gulp          = require('gulp'),
    child_process = require('child_process'),
    del           = require('del'),
    qunit         = require('node-qunit-phantomjs'),
    uglify        = require('gulp-uglify'),
    gulpUtil      = require('gulp-util'),
    concat        = require('gulp-concat'),
    smaps         = require('gulp-sourcemaps'),
    livereload    = require('gulp-livereload'),
    jsdoc         = require('gulp-jsdoc');

gulp.task('clean-doc', function () {
    del(['doc/**/*']);
});

gulp.task('clean-dist', function () {
    del(['dist/**/*']);
});

gulp.task('clean', ['clean-doc', 'clean-dist']);

//gulp.task('test', function () {
//    qunit(__dirname + '/test/index.html');
//});

gulp.task('build', ['clean-dist'], function () {
	return gulp.src('src/**/*.js')
               .pipe(smaps.init())
               .pipe(concat("openjgl.js"))
               .pipe(uglify().on('error', gulpUtil.log))
               .pipe(smaps.write())
               .pipe(gulp.dest('dist/'))
               .pipe(livereload());
});

gulp.task('doc', ['clean-doc', 'build'], function () {
    return gulp.src('src/**/*.js')
               .pipe(jsdoc('doc/', undefined, undefined,  {
                 showPrivate: false,
                 monospaceLinks: true,
                 cleverLinks: true,
                 outputSourceFiles: false
               }));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js',  ['build']);
    gulp.watch('test/**/*.js', function() {
        gulp.src('server.js')
            .pipe(livereload());
    });
});

gulp.task('dev', ['build'], function () {
    livereload.listen();
    
    child_process.fork('.');
});

gulp.task('default', ['dev', 'watch']);
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


var paths = {
    testing:'testing',
    css: 'public/css',
    images: 'public/images/**/*',
    fonts:'public/fonts',
    javascript:'public/javascript/**/*',
    uploads:'public/uploads/**/*',
    logs:'app/logs',
    config:'config/**/*',
    views:'app/views'
};

// Concat & Minify JS
gulp.task('minify', function(){
    gulp.src('public/javascript/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('testing/favascript/'));
});
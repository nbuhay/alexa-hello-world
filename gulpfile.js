var gulp = require('gulp');
var clean = require('gulp-clean');
var zip = require('gulp-zip');

var folder = '**';

gulp.task('default', () => {
	console.log('test');
});

gulp.task('deploy', () => {
	return gulp.src(folder)
		.pipe(zip('hello.zip'))
		.pipe(gulp.dest('./deploy'));
});
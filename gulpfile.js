var gulp = require('gulp');
var filter = require('gulp-filter');
var zip = require('gulp-zip');

gulp.task('default', () => {
	console.log('test');
});

gulp.task('deploy', () => {

	// include all files and folders in build 
	const folder = '**';
	// include all files that start with a . i.e. .config, .gitignore, etc.
	const opts = { nodir: true, dot: true };
	// exclude existing .zip from this build - it will be overwritten in the pipe
	const f = filter(['**', '!deploy/*.zip']);

	return gulp.src(folder, opts)
		.pipe(f)
		.pipe(zip('hello.zip'))
		.pipe(gulp.dest('./deploy'));
});
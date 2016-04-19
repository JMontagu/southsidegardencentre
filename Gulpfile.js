var gulp = require('gulp');

var config = {
     bootstrapPath: './node_modules/bootstrap-sass/assets/stylesheets'
}

gulp.task('styles', function() {
	var sass = require('gulp-sass');
	var concat = require('gulp-concat');
	var nano = require('gulp-cssnano');
	var uncss = require('gulp-uncss');
	var postcss      = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');

	gulp.src('sass/**/*.scss')
		.pipe(sass({
			style: 'compressed',
			includePaths: [
				config.bootstrapPath
			]
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(concat('main.css'))
		/*.pipe(uncss({
			html: ['index.html']
		}))
		.pipe(nano())*/
		.pipe(gulp.dest('./public/css'));
});

gulp.task('default', function() {
	gulp.watch('sass/**/*.scss',['styles']);
})
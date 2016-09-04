const gulp = require('gulp');

const config = {
     bootstrapPath: './node_modules/bootstrap-sass/assets/stylesheets'
}

gulp.task('styles', () => {
	const sass = require('gulp-sass');
	const concat = require('gulp-concat');
	const nano = require('gulp-cssnano');
	const uncss = require('gulp-uncss');
	const postcss      = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');

	gulp.src('sass/**/*.scss')
		.pipe(sass({
			style: 'compressed',
			includePaths: [
				config.bootstrapPath
			]
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(concat('main.css'))
		// .pipe(uncss({
		// 	html: ['./public/index.html']
		// }))
		.pipe(nano())
		.pipe(gulp.dest('./public/css'));
});

gulp.task('default', () => {
	gulp.watch('sass/**/*.scss', ['styles']);
})

gulp.task('build', ['styles']);
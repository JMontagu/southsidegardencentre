const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');
const data = require('gulp-data');
const frontMatter = require('gulp-front-matter');

const config = {
 	bootstrapPath: './node_modules/bootstrap-sass/assets/stylesheets',
}

gulp.task('nunjucks', () => {
	return gulp.src(['src/templates/**/*.html', '!src/templates/base.html'])
		.pipe(data(function() {
			return require('./src/siteConfig.json')
		}))
		.pipe(frontMatter())
		.pipe(nunjucks({
			searchPaths: ['src/templates']
		}))
		.pipe(gulp.dest('public'));
})

gulp.task('styles', () => {
	const sass = require('gulp-sass');
	const concat = require('gulp-concat');
	const nano = require('gulp-cssnano');
	const uncss = require('gulp-uncss');
	const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');

	gulp.src('src/sass/**/*.scss')
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
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/templates/**/*.html', ['nunjucks']);
})

gulp.task('build', ['nunjucks','styles']);
const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');
const data = require('gulp-data');
const frontMatter = require('gulp-front-matter');
const imagemin = require('gulp-imagemin');
const critical = require('critical').stream;

const config = {
 	bootstrapPath: './node_modules/bootstrap-sass/assets/stylesheets'
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

gulp.task('images', () => {
	return gulp.src('./src/images/**/*')
	  .pipe(imagemin())
	  .pipe(gulp.dest('./public/img'));
});

gulp.task('styles', ['nunjucks'], () => {
	const sass = require('gulp-sass');
	const concat = require('gulp-concat');
	const nano = require('gulp-cssnano');
	const uncss = require('gulp-uncss');
	const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');

	return gulp.src('src/sass/**/*.scss')
		.pipe(sass({
			style: 'compressed',
			includePaths: [
				config.bootstrapPath
			]
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(concat('main.css'))
		.pipe(uncss({
			html: ['./public/**/*.html'],
			ignore: [
			  '.fade',
			  '.fade.in',
			  '.collapse',
			  '.collapse.in',
			  '.collapsing',
			  '.alert-danger',
			  '.open',
			  '/open+/'
			 ]
		}))
		.pipe(nano())
		.pipe(gulp.dest('./public/css'));
});

gulp.task('critical', ['styles'], (cb) => {
  return gulp.src('public/**/*.html')
    .pipe(critical({base: 'public/', inline: true, minify: true}))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', () => {
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/templates/**/*.html', ['nunjucks']);
	gulp.watch('src/images/*', ['images']);
})

gulp.task('build', ['images','nunjucks','styles','critical']);
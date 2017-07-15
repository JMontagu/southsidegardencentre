const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');
const data = require('gulp-data');
const frontMatter = require('gulp-front-matter');
const imagemin = require('gulp-imagemin');
const critical = require('critical').stream;
const htmlmin = require('gulp-htmlmin');
const ext_replace = require('gulp-ext-replace');
const del = require('del');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');

const opt = {
  bootstrapPath: './node_modules/bootstrap-sass/assets/stylesheets',
  distFolder: './dist'
}

gulp.task('clean', (cb) => {
  del.sync([opt.distFolder]);
  cb();
});

gulp.task('nunjucks', () => {
	return gulp.src(['src/templates/**/*.html', '!src/templates/base.html'])
		.pipe(data(function() {
			return require('./src/siteConfig.json')
		}))
		.pipe(frontMatter())
		.pipe(nunjucks({
			searchPaths: ['src/templates']
		}))
    .pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(opt.distFolder));
})

gulp.task('images', () => {
	return gulp.src('./src/images/**/*')
	  .pipe(imagemin())
	  .pipe(gulp.dest(opt.distFolder + '/img'));
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
				opt.bootstrapPath
			]
		}).on('error', sass.logError))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(concat('main.css'))
		.pipe(uncss({
			html: [opt.distFolder+'/**/*.html'],
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
		.pipe(gulp.dest(opt.distFolder + '/css'))
		.pipe(rev())
		.pipe(gulp.dest(opt.distFolder + '/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest(opt.distFolder + '/css'));
});

gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(opt.distFolder + '/fonts'))
});

gulp.task('favicon', function() {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest(opt.distFolder))
})

gulp.task('build:s3', ['build'], () => {
	var manifest = gulp.src(opt.distFolder + '/css/rev-manifest.json');

  return gulp.src(opt.distFolder + '/**/*.html')
  	.pipe(revReplace({manifest: manifest}))
    .pipe(critical({base: opt.distFolder, inline: true, minify: true}))
    .pipe(gulp.dest(opt.distFolder))
    .pipe(ext_replace(''))
    .pipe(gulp.dest(opt.distFolder + '/pages'));
});

gulp.task('watch', () => {
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/templates/**/*.html', ['nunjucks']);
	gulp.watch('src/images/*', ['images']);
})

gulp.task('build', ['clean', 'images', 'nunjucks', 'styles', 'fonts', 'favicon']);
'use strict';

// Gulp file to automate the various tasks

let gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	csscomb = require('gulp-csscomb'),
	cleanCss = require('gulp-clean-css'),
	cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  cp = require('child_process'),
	cssnano = require('gulp-cssnano'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	htmlBeautify = require('gulp-html-beautify'),
	npmDist = require('gulp-npm-dist'),
	postcss = require('gulp-postcss'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	wait = require('gulp-wait');

// Define paths

var paths = {
	base: {
		node: 'node_modules'
	},
	dist: {
		base: './',
		css: 'assets/css',
		js: 'assets/js'
	},
  site: {
    base: '_site/',
    css: '_site/assets/css',
    js: '_site/assets/js'
  },
	src: {
		base: './',
    html: [
      '*.html',
      '_layouts/*.html',
      '_pages/*',
      '_posts/*',
      '_data/*',
      '_includes/*'
    ],
		css: 'assets/css',
		js: 'assets/js',
		img: 'assets/img/**/*.+(png|jpg|gif|svg)',
		vendor: 'assets/libs',
		resources: 'resources'
	}
}

// Clean CSS
gulp.task('clean:css', function(done) {
	return del([
        paths.dist.css + '/**/*.css',
        '!' + paths.dist.css + '/docs.css'
    ]);
    done();
});

// Compile SCSS

gulp.task('compile:scss', function(done) {
    console.log(paths.src.resources + '/scss/**/*.scss');
    return gulp
		.src(paths.src.resources + '/scss/**/*.scss')
		.pipe(wait(500))
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([require('postcss-flexbugs-fixes')]))
		.pipe(autoprefixer({
			browsers: ['> 1%']
		}))
		.pipe(csscomb())
		.pipe(gulp.dest(paths.site.css))
    .pipe(browserSync.reload({
			stream: true
		}))
    .pipe(gulp.dest(paths.dist.css));
	done();
});

// Minify CSS

gulp.task('minify:css', function(done) {
	return gulp.src(paths.dist.css + '/purpose.css')
		.pipe(sourcemaps.init())
		.pipe(cleanCss())
		.pipe(rename({
			suffix: '.min'
		}))
    .pipe(gulp.dest(paths.site.css))
		.pipe(gulp.dest(paths.dist.css))
    done();
});

// Clean JS

gulp.task('clean:js', function(done) {
	return del([
        paths.dist.js + '/**/*.js',
        '!' + paths.dist.js + '/main.js',
        '!' + paths.dist.js + '/docs.js'
    ]);
    done();
});

// Concat JS

gulp.task('concat:js-core', function(done) {
	return gulp
		.src([
          'assets/libs/jquery/dist/jquery.min.js',
	        'assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js',
	        'assets/libs/in-view/dist/in-view.min.js',
	        'assets/libs/sticky-kit/dist/sticky-kit.min.js',
	        'assets/libs/svg-injector/dist/svg-injector.min.js',
	        'assets/libs/jquery.scrollbar/jquery.scrollbar.min.js',
	        'assets/libs/jquery-scroll-lock/dist/jquery-scrollLock.min.js',
	        'assets/libs/imagesloaded/imagesloaded.pkgd.min.js'
        ])
		.pipe(concat('purpose.core.js'))
    .pipe(gulp.dest(paths.site.js))
		.pipe(gulp.dest(paths.dist.js));

	done();
});

gulp.task('concat:js', function(done) {
	return gulp
		.src([
            paths.src.resources + '/js/purpose/license.js',
      			paths.src.resources + '/js/purpose/layout.js',
      			paths.src.resources + '/js/purpose/init/*.js',
      			paths.src.resources + '/js/purpose/custom/*.js',
      			paths.src.resources + '/js/purpose/maps/*.js',
      			paths.src.resources + '/js/purpose/charts/*.js',
      			paths.src.resources + '/js/purpose/libs/*.js',
      			paths.src.resources + '/js/purpose/charts/*js'
        ])
		.pipe(concat('purpose.js'))
		.pipe(gulp.dest(paths.site.js))
    .pipe(browserSync.reload({
			stream: true
		}))
    .pipe(gulp.dest(paths.dist.js));
	done();
});

// Minify JS

gulp.task('minify:js', function(done) {
	return gulp.src(paths.dist.js + '/purpose.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
    .pipe(gulp.dest(paths.site.js))
		.pipe(gulp.dest(paths.dist.js))
    done();
});

// Copy JS

gulp.task('copy:js', function(done) {
  return gulp.src([
      paths.src.js + '/main.js'
    ])
    .pipe(gulp.dest(paths.site.js))
    done();
});

// Clean

gulp.task('clean:dist', function(done) {
	return del([
        paths.dist.css + '/**/purpose*.css',
        paths.dist.js + '/**/purpose*.js'
    ]);
    done();
});

gulp.task('clean:site', gulp.series('clean:dist'), function(done) {
  return del(paths.site.base);
  done();
});

// Copy CSS

gulp.task('copy:css', function(done) {
	return gulp.src([
			paths.src.base + '/assets/css/theme.css'
		])
		.pipe(gulp.dest(paths.dist.base + '/css'))
    done();
});

// Create dist folder

gulp.task('create:dist', function(done) {
	return gulp.src([
			'./assets/**/purpose*.+(js|css)'
		])
		.pipe(gulp.dest('./dist'))
    done();
});

//  BrowserSync

// Initialize the browsersync

function browserSyncServe(done) {
	browserSync.init({
		server: {
			baseDir: '_site'
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload (callback)

function browserSyncReload(done) {
	browserSync.reload();
	done();
}

function watchFiles() {
    gulp.watch(paths.src.resources + '/scss/**/*.scss', gulp.series('compile:scss'));
    gulp.watch(paths.src.resources + '/js/**/*.js', gulp.series('concat:js'));
    gulp.watch(paths.src.js + '/main.js', gulp.series('copy:js', browserSyncReload));
    gulp.watch(
      paths.src.html, 
      gulp.series(jekyllBuild, browserSyncReload)
    );
}

// Bundled tasks

gulp.task('js', gulp.series('clean:js', 'concat:js-core', 'concat:js', 'minify:js', 'copy:js'));
gulp.task('css', gulp.series('clean:css', 'compile:scss', 'minify:css'));
gulp.task('browserSync', gulp.series(browserSyncServe, watchFiles));

// Jekyll

function jekyllBuild() {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
}

// Build

gulp.task('build', gulp.series('clean:site', 'css', 'js', jekyllBuild));

// Serve

gulp.task('serve', gulp.parallel('build', 'browserSync'))

// Default

gulp.task('default', gulp.series('serve'));

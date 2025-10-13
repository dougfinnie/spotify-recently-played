const gulp = require('gulp');
const download = require('gulp-download');
const replace = require('gulp-replace');
const path = require('path');

// Copy Bootstrap CSS from node_modules
function copyBootstrapCSS() {
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('public/css'));
}

// Copy Bootstrap JS from node_modules
function copyBootstrapJS() {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(gulp.dest('public/js'));
}

// Download Bootstrap Icons from CDN (more reliable for fonts)
function downloadBootstrapIconsCSS() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css')
    .pipe(replace(/url\("\.\/fonts\/bootstrap-icons\.woff2\?[^"]*"\)/g, 'url("./fonts/bootstrap-icons.woff2")'))
    .pipe(replace(/url\("\.\/fonts\/bootstrap-icons\.woff\?[^"]*"\)/g, 'url("./fonts/bootstrap-icons.woff")'))
    .pipe(gulp.dest('public/css'));
}

// Download Bootstrap Icons fonts from CDN
function downloadBootstrapIconsWoff2() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2')
    .pipe(gulp.dest('public/css/fonts'));
}

function downloadBootstrapIconsWoff() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff')
    .pipe(gulp.dest('public/css/fonts'));
}

// Create simple favicon (we'll create a basic one)
function createFavicon() {
  // For now, we'll skip favicon creation since the existing ones work
  return Promise.resolve();
}

// Create apple touch icon
function createAppleTouchIcon() {
  // For now, we'll skip apple touch icon creation since the existing ones work
  return Promise.resolve();
}

// Watch for changes (optional - for development)
function watchFiles() {
  gulp.watch('public/style.css', function() {
    console.log('CSS file changed, consider rebuilding...');
  });
}

// Combined copy task
const copyAll = gulp.parallel(copyBootstrapCSS, copyBootstrapJS, downloadBootstrapIconsCSS, downloadBootstrapIconsWoff2, downloadBootstrapIconsWoff);

// Default task
gulp.task('default', copyAll);
gulp.task('build', copyAll);
gulp.task('watch', gulp.series(copyAll, watchFiles));

// Export tasks for npm scripts
exports.build = copyAll;
exports.watch = gulp.series(copyAll, watchFiles);

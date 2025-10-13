const gulp = require('gulp');
const download = require('gulp-download');
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

// Copy Bootstrap Icons CSS from node_modules
function copyBootstrapIconsCSS() {
  return gulp.src('node_modules/bootstrap-icons/font/bootstrap-icons.css')
    .pipe(gulp.dest('public/css'));
}

// Copy Bootstrap Icons fonts from node_modules
function copyBootstrapIconsFonts() {
  return gulp.src('node_modules/bootstrap-icons/font/fonts/*')
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
const copyAll = gulp.parallel(copyBootstrapCSS, copyBootstrapJS, copyBootstrapIconsCSS, copyBootstrapIconsFonts);

// Default task
gulp.task('default', copyAll);
gulp.task('build', copyAll);
gulp.task('watch', gulp.series(copyAll, watchFiles));

// Export tasks for npm scripts
exports.build = copyAll;
exports.watch = gulp.series(copyAll, watchFiles);

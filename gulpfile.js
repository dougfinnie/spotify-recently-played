const gulp = require('gulp');
const download = require('gulp-download');
const path = require('path');

// Download Bootstrap CSS
function downloadBootstrap() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('public/css'));
}

// Download Bootstrap Icons CSS
function downloadBootstrapIcons() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css')
    .pipe(gulp.dest('public/css'));
}

// Download Bootstrap Icons font files
function downloadBootstrapIconsWoff2() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2')
    .pipe(gulp.dest('public/css/fonts'));
}

function downloadBootstrapIconsWoff() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff')
    .pipe(gulp.dest('public/css/fonts'));
}

// Download favicon
function downloadFavicon() {
  return download('https://www.google.com/s2/favicons?domain=spotify.com&sz=16')
    .pipe(gulp.dest('public'));
}

// Download apple touch icon
function downloadAppleTouchIcon() {
  return download('https://www.google.com/s2/favicons?domain=spotify.com&sz=180')
    .pipe(gulp.dest('public'));
}

// Watch for changes (optional - for development)
function watchFiles() {
  gulp.watch('public/style.css', function() {
    console.log('CSS file changed, consider rebuilding...');
  });
}

// Combined download task
const downloadAll = gulp.parallel(downloadBootstrap, downloadBootstrapIcons, downloadBootstrapIconsWoff2, downloadBootstrapIconsWoff, downloadFavicon, downloadAppleTouchIcon);

// Default task
gulp.task('default', downloadAll);
gulp.task('download', downloadAll);
gulp.task('watch', gulp.series(downloadAll, watchFiles));

// Export tasks for npm scripts
exports.download = downloadAll;
exports.watch = gulp.series(downloadAll, watchFiles);

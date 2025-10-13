const gulp = require('gulp');
const download = require('gulp-download');
const path = require('path');

// Download Bootstrap CSS
function downloadBootstrap() {
  return download('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('public/css'));
}

// Watch for changes (optional - for development)
function watchFiles() {
  gulp.watch('public/style.css', function() {
    console.log('CSS file changed, consider rebuilding...');
  });
}

// Default task
gulp.task('default', downloadBootstrap);
gulp.task('download', downloadBootstrap);
gulp.task('watch', gulp.series(downloadBootstrap, watchFiles));

// Export tasks for npm scripts
exports.download = downloadBootstrap;
exports.watch = gulp.series(downloadBootstrap, watchFiles);

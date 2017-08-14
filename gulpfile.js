/**
 * Created by Zed on 2017/8/2.
 */
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const $ = gulpLoadPlugins();



gulp.task('test',()=> {

})
function lint(files, options) {
    return gulp.src(files)
        .pipe(reload({stream: true, once: true}))
        .pipe($.eslint(options))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
    return lint('src/**/*.js', {
        fix: true
    })
        .pipe(gulp.dest('src'));
});
gulp.task('lint:test', () => {
    return lint('test/spec/**/*.js', {
        fix: true,
        env: {
            mocha: true
        }
    })
        .pipe(gulp.dest('test/spec/**/*.js'));
});
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['lint'], () => {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
    gulp.start('build');
});

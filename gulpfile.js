/**
 * Created by Zed on 2017/8/2.
 */
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const $ = gulpLoadPlugins();

function lint(files, options) {
    return gulp.src(files)
        .pipe($.eslint(options))
        .pipe($.eslint.format())
        .pipe($.if('.js',$.eslint.failAfterError()));
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
gulp.task('script',()=>{
    return gulp.src('src/*.js')
        .pipe($.umd())
        .pipe($.uglify())

        .pipe(gulp.dest('dist'))
})
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['lint','script'], () => {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
    gulp.start('build');
});

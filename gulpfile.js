const gulp = require('gulp');
const lec = require('gulp-line-ending-corrector');
const gutil = require("gulp-util");
const newer = require('gulp-newer');
const babel = require("gulp-babel");
const through = require("through2");
const plumber = require("gulp-plumber");
const watch = require("gulp-watch");
const path = require("path");
const chalk = require("chalk");
const dest = "./lib";


const scripts = ['./src/*.js'];
var srcEx, libFragment;

if (path.win32 === path) {
  srcEx = /\\src\\/;
  libFragment = "\\lib\\";
} else {
  srcEx = new RegExp("/src/");
  libFragment = "/lib/";
}

const filelog = (title) => {
  return through.obj((file, enc, callback) => {
    file.path = file.path.replace(srcEx, libFragment);
    gutil.log(title, "'" + chalk.cyan(path.relative(process.cwd(), file.path)));
    callback(null, file);
  });
}


gulp.task("build", () => {
  return gulp.src(scripts)
    .pipe(plumber({ errorHandler (err) { gutil.log(err.message + '\r\n' + err.codeFrame); }}))
    .pipe(through.obj(function (file, enc, callback) {
      file._path = file.path;
      file.path = file.path.replace(srcEx, libFragment);
      callback(null, file);
    }))
    .pipe(newer(dest))
    .pipe(filelog('Compile'))
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task("watch", ['build'], (callback) => {
  watch(scripts, {debounceDelay: 200}, () => gulp.start("build"));
});
const gulp = require("gulp");
const concat = require("gulp-concat");
gulp.task("build-script", function () {
  return gulp.src("./build/static/js/*.js").pipe(concat("intakeFormApp.js")).pipe(gulp.dest("z:/js"));
});
gulp.task("build-css", function () {
  return gulp.src("./build/static/css/*.css").pipe(concat("intakeFormApp.css")).pipe(gulp.dest("z:/css"));
});
gulp.task("default", gulp.parallel(["build-script", "build-css"]));
Cannot find module 'gulp-concat'
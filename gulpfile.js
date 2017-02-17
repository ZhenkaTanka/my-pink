var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");

gulp.task("style", function() {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([autoprefixer({browsers: ["last 2 versions"]})]))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task("serve", function() {
    browserSync.init({
        server:{
            baseDir: "./"
        }
    });

    gulp.watch("less/**/*.less", ["style"]);
    gulp.watch("*.html").on("change", browserSync.reload);
});

gulp.task("default", ["style", "serve"]);
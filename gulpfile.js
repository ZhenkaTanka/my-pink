var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var mqpacker = require("css-mqpacker");
var cssmin = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var secuence = require("run-sequence");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([autoprefixer({browsers: ["last 2 versions"]}),
                      mqpacker({
                          sort: true
                      })
                      ]))
        .pipe(gulp.dest("build/css"))
        .pipe(cssmin())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task("images", function () {
   gulp.src("build/img/**/*.{png,jpg,gif}") 
    .pipe(imagemin([
       imagemin.optipng({optimizationLevel: 3}),
       imagemin.jpegtran({progressive: true})
   ]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("svgsprite", function () {
    return gulp.src("build/img/icons/*.svg")
        .pipe(svgmin())
        .pipe(svgstore({
        inlineSvg: true
    }))
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("build/img"))
});

gulp.task("copy", function() {
   gulp.src([
       "fonts/**/*.{woff,woff2}",
       "img/**",
       "js/**",
       "*.html"
       ], {
       base: "."
   })
   .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    del("build");
});

gulp.task("serve", function() {
    browserSync.init({
        server:{
            baseDir: "build"
        }
    });

    gulp.watch("less/**/*.less", ["style"]);
    gulp.watch("*.html").on("change", browserSync.reload);
});

gulp.task("build", function(fn) {
    run("clean","copy" ,"style", "images", "svgsprite", fn);
});
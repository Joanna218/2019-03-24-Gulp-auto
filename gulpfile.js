//  套件定義
//  在package.json內引用的套件
//  npm install gulp --global

//  gulp / yarn run gulp

const gulp = require("gulp");
const gulpSass = require("gulp-sass");
// 架設webServer的環境
const connect = require("gulp-connect");
// 圖片壓縮
const imagemin = require("gulp-imagemin");
// CSS Sprite 把所有小圖合成一個大圖
const spritesmith = require("gulp.spritesmith");

//  ============================================================
//          工作 1 建構SASS Compiler
//  ============================================================

const buildSass = function(cb) {
  console.log("buildSass");
  gulp
    .src("./src/styles/index.scss")
    .pipe(gulpSass())
    .pipe(gulp.dest("build/"))
    .pipe(connect.reload());
  cb();
};

// 壓縮圖片
const compressImage = async function(cb) {
  console.log("CompressImage");
  gulp
    .src("src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/images"));
  cb();
};

// 壓縮字型
const webFont = async function(cb) {
  console.log("webFont");
  gulp.src("./src/fonts/*").pipe(gulp.dest("build/fonts/"));
  cb();
};

// 壓縮CSSSprite小圖示變一張大圖
// sprite裡的小圖大部分都找png檔
const CSSSprite = async function(cb) {
  console.log("CSSSprite");
  gulp
    .src("src/sprite/*.png")
    .pipe(
      spritesmith({
        imgName: "sprite.png",   // 組成大圖的檔名
        cssName: "sprite.css"    // 每一個小圖的css
      })
    )
    .pipe(gulp.dest("build"));
  cb();
};

// 連server 可能要10秒，因此用非同步async呼叫
// 用async可能會load比較久，耗CPU
const webServer = async function() {
  console.log("reload");
  // connect.server()
  connect.server({
    livereload: true
  });
};

/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */

// 監控程式
// 所有gulp設定好都要監聽，用watch去呼叫gulp套件設定
gulp.watch("src/**/*.scss", { events: "all" }, function(cb) {
  console.log("change SASS");
  buildSass(cb);
  cb();
});

gulp.watch("src/images/**/*.*", { events: "all" }, function(cb) {
  console.log("change Images");
  compressImage(cb);
  cb();
});

gulp.watch("src/fonts/**/*.*", { events: "all" }, function(cb) {
  console.log("change webfont");
  webFont(cb);
  cb();
});

gulp.watch("src/sprite/**/*.*", { events: "all" }, function(cb) {
  console.log("change css sprite");
  CSSSprite(cb);
  cb();
});
// exports.default = buildSass;
exports.default = gulp.series(
  buildSass,
  webServer,
  compressImage,
  webFont,
  CSSSprite
);
// exports.default = gulp..parallel(buildSass, webServer);

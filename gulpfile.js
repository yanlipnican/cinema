var gulp = require("gulp");
var babel = require("gulp-babel");
var less = require("gulp-less");
var nodemon = require("gulp-nodemon");
var clean = require("gulp-clean");
var mergeStream = require("merge-stream");
var watch = require("gulp-watch");

gulp.task("es6-node", function () {
  return gulp.src("src/backend/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("app/"));
});

gulp.task('watch', function () {
  gulp.watch('src/frontend/javascript/*.js', ['es6-frontend']);
  gulp.watch('src/frontend/styles/*.less', ['less']);
});

gulp.task("es6-frontend", function(){
  return gulp.src("src/frontend/javascript/*.js")
    .pipe(babel())
    .pipe(gulp.dest("public/javascript/"));
});

gulp.task("less", function(){
	return gulp.src("src/frontend/styles/main.less")
		.pipe(less())
		.pipe(gulp.dest("public/styles/"));
});

gulp.task('clean', function () {
    var folders = ['app', 'public/javascript', 'public/styles']
    var tasks = folders.map(function(folder){
      return gulp.src(folder, {read: false})
        .pipe(clean());
    })
    return mergeStream(tasks);
});

gulp.task('nodemon', function () {
    nodemon({ 
      script: 'app/app.js',
        ext: 'js',
        ignore: [
            'app/',
            'node_modules/',
            'public/javascript/',
            'src/frontend/',
            'gulpfile.js'
          ],
        tasks: ['build-backend'] 
      })
    .on('restart', function () {
      console.log('server restarted!');
    });
});

gulp.task('build', ['es6-node', 'less', 'es6-frontend']);

gulp.task('build-backend', ['es6-node']);

gulp.task('devel', ['nodemon', 'watch']);

gulp.task('run', function(){
	nodemon({script: 'app/app.js'});
});

gulp.task('default', ['run']);


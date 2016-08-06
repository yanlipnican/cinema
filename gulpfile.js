var gulp = require("gulp");
var babel = require("gulp-babel");
var watch = require("gulp-watch");
var less = require("gulp-less");
var nodemon = require("gulp-nodemon");

gulp.task("es6-node", function () {
  return gulp.src("src/backend/javascript/*.js")
    .pipe(babel())
    .pipe(gulp.dest("app/javascript"));
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

gulp.task('watch', function(){
	gulp.watch('src/backend/javascript/*.js', ['es6-node']);
	gulp.watch('src/frontend/styles/*.less', ['less']);	
});

gulp.task('build', ['es6-node', 'less', 'es6-frontend']);

gulp.task('devel', function () {
  	nodemon({ 
  		script: 'app/javascript/app.js',
        ext: 'html js less',
        ignore: [
            'app/',
            'node_modules/'
        	],
        tasks: ['build'] 
      })
    .on('restart', function () {
      console.log('server restarted!');
    });
});

gulp.task('run', function(){
	nodemon({script: 'app/javascript/app.js'});
});

gulp.task('default', ['run']);


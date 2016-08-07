import models from '../models/mainModels';
import hash from '../hash';

const isEmpty = (val) => {
	if(typeof(val) !== "undefined" && val !== ""){
		return false;
	} else return true;
}

module.exports = (app) => {

	app.get('/', (req, res) => {

		models.post.find((err, posts) => {
			let sendData;
			if(!err) res.render('home', {posts, title: 'Home'});
		});

	});

	app.get('/admin', (req, res) => {
		if(req.session.email) res.render('admin-hp', {layout : 'admin'});
		else res.redirect('/admin/login');
	});

	app.get('/admin/login', (req, res) => {
		if(req.session.email) res.redirect('/admin');
		else res.render('admin-login', {layout : 'blank'});
	});

	app.get('/admin/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/admin/login');
	});

	app.post('/admin/login', (req, res) => {
		if(!isEmpty(req.body.email) && !isEmpty(req.body.password)){
			models.adminUser.find({email : req.body.email}, (err, users) =>{
				if(users.length > 0 && users[0].password === hash.password(req.body.password, users[0].salt)){
					req.session.email = req.body.email;
					res.redirect('/admin');
				} else {
					res.render('admin-login', {layout : 'blank', error : "Wrong email or password"});
				}
			});
		} else {
			res.render('admin-login', {layout : 'blank', error : 'Fill all inputs.'});
		}
	});

	app.get('/register', (req, res) => {
		res.render('register', {layout : 'blank'});
	});

	app.post('/register', (req, res) => {
		if(!isEmpty(req.body.email) && !isEmpty(req.body.name) && !isEmpty(req.body.password)){
			models.user.find({email : req.body.email}, (err, users) => {
				if(users.length === 0){
					let password = hash.createPassword(req.body.password);
					let user = new models.user({
						name: req.body.name,
						email: req.body.email,
						password : password.value,
						salt : password.salt
					});
					user.save();
					res.redirect('/login');
				} else {
					res.render('admin-register', {layout : 'blank', error : 'User with this email exists'});
				}
			});
		} else {
			res.render('admin-register', {layout : 'blank', error : 'Fill all inputs.'});
		}
	});



	// 404 must always be last route

	app.get('*', function(req, res){
	  res.render('404', {layout : 'blank'});
	});

}
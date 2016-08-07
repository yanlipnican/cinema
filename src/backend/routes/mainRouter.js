import models from '../models/mainModels'

const isEmpty = (string) => {
	if(typeof(string) !== "undefined" && string !== ""){
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

	app.get('/admin/register', (req, res) => {
		/*
		let klaudia = new models.adminUser({name: 'klaudika', email: 'klaudia.brisak@gmail.com', password : 'lubimjanka'});
		klaudia.save();
		console.log(klaudia);
		*/
		res.redirect('/admin/login');
	});

	app.post('/admin/login', (req, res) => {
		if(!isEmpty(req.body.email) && !isEmpty(req.body.password)){
			models.adminUser.find({email : req.body.email}, (err, users) =>{
				if(users.length > 0 && users[0].password == req.body.password){
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

}
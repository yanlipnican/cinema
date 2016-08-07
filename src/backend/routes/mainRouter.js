import models from '../models/mainModels'

module.exports = (app) => {

	app.get('/', (req, res) => {

		models.post.find(function (err, posts) {
			let sendData;
			if(!err) res.render('home', {posts, title: 'Home'});
		});

	});

	app.get('/admin', (req, res) => {
		if(req.session.name) res.render('admin-hp', {layout : 'admin'});
		else res.redirect('/admin/login');
	});

	app.get('/admin/login', (req, res) => {
		if(req.session.name) res.redirect('/admin');
		else res.render('admin-login', {layout : 'blank'});
	});

}
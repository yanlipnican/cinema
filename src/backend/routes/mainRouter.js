import models from '../models/mainModels'

module.exports = (app) => {

	app.get('/', (req, res) => {

		models.post.find(function (err, posts) {
			let sendData;
			if(!err) res.render('home', {posts, title: 'Home'});
		});

	});

	app.get('/admin', (req, res) => {
		res.render('admin-hp', {layout : 'admin'});
	});

}
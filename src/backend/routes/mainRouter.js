import models from '../models/mainModels'

module.exports = (app) => {

	app.get('/', (req, res) => {

		models.post.find(function (err, posts) {
			let sendData;
			if(err)
				res.render('home', {posts, status : false});
			else
				res.render('home', {posts, status : true});
		});

	});

}
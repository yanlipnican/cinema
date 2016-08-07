import models from '../models/mainModels'

module.exports = (app) => {

	app.get('/', (req, res) => {

		models.post.find(function (err, posts) {
			let sendData;
			if (err){
				sendData = Object.assign({posts}, {success: false});
			} else{
				sendData = Object.assign({posts}, {success: true});
			}
			res.render('home', sendData);
		});

	});

}
/*
*	base controller
*	some smaller and simple controllers are here
*	such as serving just pages
*/

import models from '../models';

module.exports = (app) => {
	
	/*
	*	Homepage
	*/

	app.get('/', (req, res) => {

		const data = {title:'cinema'};

		models.post.find((err, posts) => {
			
			data.posts = posts;

			if(!err) res.render('home', data);
			else res.render('500', {layout : 'blank'});
		});

	});

};
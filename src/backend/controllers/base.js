/*
*	base controller
*	some smaller and simple controllers are here
*	such as serving just pages
*/

module.exports = (app) => {
	
	/*
	*	Homepage
	*/

	app.get('/', (req, res) => {

		const data = {title:'cinema'};

		models.post.find().limit(8).sort({createdAt : -1}).exec((err, posts) => {
			
			data.posts = [];

			for (var i = 0; i < posts.length; i++) {
				data.posts.push(posts[i].toJSON());
			}

			if(!err) res.render('home.twig', data);
			else res.render('500', {layout : 'blank'});
			
		});

	});

};
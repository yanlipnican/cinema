module.exports = (app) => {
	
	//	
	// post detail
	//

	app.get('/', (req, res) => {

		models.post.find().limit(8).sort({createdAt : -1}).exec((err, posts) => {
			
			const data = {
				title : config.projectName
			};

			data.posts = [];

			for (var i = 0; i < posts.length; i++) {
				data.posts.push(posts[i].toJSON());
			}

			if(!err) res.render('home.twig', data);
			else res.render('500.twig');
			
		});
	});


};
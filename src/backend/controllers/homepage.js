module.exports = (app) => {
	
	//	
	// post detail
	//

	app.get('/', (req, res) => {

		const data = {
			title : config.projectName
		};

		helper.getCollection(data,[
				{name : 'post', limit : 5, order : -1}, 
				{name : 'spitFact', limit : 3, order : -1}
			], 
			() => {

				res.render('home.twig', data);

			}
		);

	});


};
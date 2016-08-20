module.exports = (app) => {

	app.get('/', (req, res) => {

		const data = {
			title : config.projectName
		};

		db.getCollection(data, [{name : 'post', limit : 5}, {name : 'spitFact', limit : 3}], () => {
			res.render('home.twig', data);
		});

	});

};
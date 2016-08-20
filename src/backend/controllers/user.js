/*
*	
*	Controller for user
*	
*/

module.exports = (app) => {
	
	app.get('/register', (req, res) => {
		res.render('register.twig', {layout : 'blank'});
	});

	app.post('/register', (req, res) => {
		if(!Valid.isEmpty(req.body.email) && !Valid.isEmpty(req.body.name) && !Valid.isEmpty(req.body.password)){
			
			let user = new models.user({
				name: req.body.name,
				email: req.body.email
			});

			user.exist()
				.then((exists) => {
					if(!exists){
						user.createPassword(req.body.password);
						user.save();
						res.redirect('/login');
					} else res.render('register.twig', {layout : 'blank', error : 'User with this email exists'});
				});

		} else {
			res.render('register.twig', {layout : 'blank', error : 'Fill all inputs'});
		}
	});

};

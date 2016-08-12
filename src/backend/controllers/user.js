/*
*	
*	Controller for user
*	
*/

import models from '../models';
import helper from '../helpers';
import hash from '../hash';

module.exports = (app) => {
	
	app.get('/register', (req, res) => {
		res.render('register', {layout : 'blank'});
	});

	app.post('/register', (req, res) => {
		if(!helper.isEmpty(req.body.email) && !helper.isEmpty(req.body.name) && !helper.isEmpty(req.body.password)){
			
			let user = new models.user({
				name: req.body.name,
				email: req.body.email
			});

			user.exist((exist) => {
				if(!exist){
					user.createPassword(req.body.password);
					user.save();
					res.redirect('/login');
				} else res.render('register', {layout : 'blank', error : 'User with this email exists'});
			});

		} else {
			res.render('register', {layout : 'blank', error : 'Fill all inputs'});
		}
	});

};

/*
*	User Register
*/

// some imports
import models from '../models';
import helper from '../helpers'

let title = 'Register new user';

const route = '/register';

const get = (req, res) => {
	res.render('register', {layout : 'blank'});
}

const post = (req, res) => {
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
}

module.exports = {
	title,
	route,
	post,
	get
}
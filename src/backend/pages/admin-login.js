/*
*	Login to admin page
*/

import models from '../models';
import hash from '../hash';
import helper from '../helpers'

let title = 'Sign in';

const route = '/admin/login';

const get = (req, res) => {
	if(req.session.email) res.redirect('/admin');
	else res.render('admin-login', {layout : 'blank'});
}

const post = (req, res) => {
	if(!helper.isEmpty(req.body.email) && !helper.isEmpty(req.body.password)){
		models.adminUser.find({email : req.body.email}, (err, users) =>{
			if(users.length > 0 && users[0].password === hash.password(req.body.password, users[0].salt)){
				req.session.email = req.body.email;
				res.redirect('/admin');
			} else {
				res.render('admin-login', {layout : 'blank', error : "Wrong email or password"});
			}
		});
	} else {
		res.render('admin-login', {layout : 'blank', error : 'Fill all inputs.'});
	}
}

module.exports = {
	title,
	route,
	post,
	get
}
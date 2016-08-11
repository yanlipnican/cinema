/*
*	Admin
*/

import models from '../models';

let title = 'Admin';

const route = '/admin';

const data = {
	layout : 'admin'
}

const get = (req, res) => {
	if(req.session.email){
		data.models = [];
		for(let key in models){
			if(models[key].access) data.models.push(models[key]._name);
		}
		res.render('admin-hp', data);
	}
	else res.redirect('/admin/login');

}

const post = undefined;

module.exports = {
	title,
	route,
	post,
	get
}
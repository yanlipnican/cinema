/*
*	json get accessable collecions
*/

import models from '../models';
import helper from '../helpers';

const route = '/admin/add-data/:col/:page?';

const get = (req, res) => {

	if(helper.isUndefined(req.session.email)) res.redirect('/admin/login');
	else {
		if(helper.isUndefined(req.params.col)) res.redirect('/admin');
		else {
			const data = {
				layout : 'admin',
				title : 'Add data'
			}

			if(!helper.isUndefined(models[req.params.col]) && models[req.params.col].access){
				models[req.params.col].find().limit(15).exec((err, documents) => {
					data.col = documents;
					console.log(documents);
					res.render('add-data', data);
				});
			} else {
				data.error = 'Collection ' + req.params.col + ' not found.';
				res.render('add-data', data);
			}
		}
	}
}

const post = undefined;

module.exports = {
	route,
	post,
	get
}
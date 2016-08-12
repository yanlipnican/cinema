/*
*	
*	Controller for admin
*	
*/

import models from '../models';
import helper from '../helpers';
import hash from '../hash';

module.exports = (app) => {

	app.get('/admin', (req, res) => {

		const data = {
			layout : 'admin'
		}

		if(req.session.email){
			data.models = [];
			for(let key in models){
				if(models[key].access) data.models.push(models[key]._name);
			}
			res.render('admin-hp', data);
		}
		else res.redirect('/admin/login');

	});

	app.get('/admin/login', (req, res) => {
		if(req.session.email) res.redirect('/admin');
		else res.render('admin-login', {layout : 'blank'});
	});

	app.post('/admin/login', (req, res) => {
		if(!helper.isEmpty(req.body.email) && !helper.isEmpty(req.body.password)){
			models.adminuser.find({email : req.body.email}, (err, users) =>{
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
	});

	app.get('/admin/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/admin/login');
	});

	app.post('/admin/logout', (req, res) => {
		req.session.destroy();
	});

	app.get('/admin/add-data/:col/:page?', (req, res) => {

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

	});

};
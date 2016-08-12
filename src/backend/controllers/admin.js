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

		if(req.session.email){

			const data = {
				layout : 'admin',
				cols : []
			};

			for(let key in models){
				if(models[key].access) data.cols.push(models[key]._name);
			}
			res.render('admin-hp.twig', data);
		}
		else res.redirect('/admin/login');

	});

	app.get('/admin/login', (req, res) => {
		if(req.session.email) res.redirect('/admin');
		else res.render('admin-login.twig', {layout : 'blank'});
	});

	app.post('/admin/login', (req, res) => {
		if(!helper.isEmpty(req.body.email) && !helper.isEmpty(req.body.password)){
			models.adminuser.find({email : req.body.email}, (err, users) =>{
				if(users.length > 0 && users[0].password === hash.password(req.body.password, users[0].salt)){
					req.session.email = req.body.email;
					res.redirect('/admin');
				} else {
					res.render('admin-login.twig', {layout : 'blank', error : "Wrong email or password"});
				}
			});
		} else {
			res.render('admin-login.twig', {layout : 'blank', error : 'Fill all inputs.'});
		}
	});

	app.get('/admin/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/admin/login');
	});

	app.post('/admin/logout', (req, res) => {
		req.session.destroy();
	});

	app.post('/admin/get-collection-list', (req, res) =>{
		
		if(helper.isUndefined(req.session.email))res.redirect('/admin/login');
		else {
			const data = { cols : []};

			for (let key in models) {

				if(models[key].access){
					data.cols.push(models[key]._name);
				}
			}

			res.json(data);
		}	
	});

	app.get('/admin/show-data/:col/:page?', (req, res) => {

		if(helper.isUndefined(req.session.email)) res.redirect('/admin/login');
		else {
			if(helper.isUndefined(req.params.col)) res.redirect('/admin');
			else {
				const data = {
					layout : 'admin',
					title : `Show - ${req.params.col}`,
					colName : req.params.col 
				}

				if(!helper.isUndefined(models[req.params.col]) && models[req.params.col].access){
					models[req.params.col].find().limit(15).exec((err, documents) => {
						data.col = [];
						for (var i = 0; i < documents.length; i++) {
							data.col.push(documents[i].toJSON());
						}
						res.render('show-data.twig', data);
					});
				} else {
					data.error = 'Collection ' + req.params.col + ' not found.';
					res.render('show-data.twig', data);
				}
			}
		}

	});

	app.post('/admin/delete-data/:col/:id', (req, res) => {

		if(helper.isUndefined(req.session.email)) res.json(false);
		else {
			if(helper.isUndefined(req.params.col) && helper.isUndefined(req.params.id)) res.json({error : 'Undefined collection or id.'});
			else {
				models[req.params.col].findOne({_id : req.params.id}, (err, document) => {
					if(helper.isUndefined(document)) res.json({error : `${req.params.col} not found.`});
					else {
						document.remove();
						res.json({success : `${req.params.col} has been removed.`});
					}
				});
			}

		}

	});

	app.get('/admin/add-data/:col', (req, res) => {
		if(helper.isUndefined(req.session.email)) res.redirect('/admin/login');
		else {
			if(helper.isUndefined(req.params.col)) res.redirect('/admin');
			else {

				const data = {
					title: `Add ${req.params.col}`,
					structure: [],
					colName: req.params.col
				}

				for(let key in models[req.params.col].schema.tree){
					if(models[req.params.col].schema.tree[key].name === "String"){
						data.structure.push(key);
					}
				}

				res.render('admin-add-data.twig', data);

			}
		}
	});

	app.post('/admin/add-data/:col', (req, res) => {
		if(helper.isUndefined(req.session.email)) res.redirect('/admin/login');
		else {
			if(helper.isUndefined(req.params.col)) res.json({error: 'Collection doesnt exist'});
			else {

				/*
				let allFilled = true;

				for(let key in models[req.params.col].schema.tree){
					if(models[req.params.col].schema.tree[key].name === "String"){
						allow = !helper.isEmpty(req.body[key]);
						break;
					}
				}

				if(allFilled){

				}
				*/

				const documentData = {};

				for(let key in req.body){
					documentData[key] = req.body[key] || "";
				}

				const document = new models[req.params.col](documentData);
				document.save();

				res.json({success : `${req.params.col} has been added`});
			}
		}
	});

};
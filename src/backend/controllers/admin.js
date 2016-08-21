/*
*	
*	Controller for admin
*	
*/


const pagination = (req, data, limit) => {
	return new Promise(resolve => {
		let findParams = {};
		let category = req.params.category;
		if(!Valid.isUndefined(category)) findParams.category = category;

		models[req.params.col].count(findParams, (err, count) => {

			data.pageCount = Math.ceil(count / limit);

			let page = req.params.page - 1 || 0;

			if (page < 0) page = 0;
			if (page >= data.pageCount) page = data.pageCount - 1;

			data.currentPage = page + 1;
			data.currentCategory = category;

			let dbData = {};

			db.getCollection(dbData,[
					{name : req.params.col, limit : limit, skip: limit * page,  rules: findParams}, 
					{name : 'category'}
				], 
				() => {
					let documents = dbData[req.params.col + 's'];
					data.col = [];
					if (documents.length > 0) {
						for (var i = 0; i < documents.length; i++) {
							data.col.push(documents[i].toJSON());
						}
					}
					if(models[req.params.col].structure.category){
						data.categories = [];
						for (let i = 0; i < dbData.categorys.length; i++) {
							data.categories.push(dbData.categorys[i].name);
						}
					}
					resolve();
				}
			);
		});
	});
};

module.exports = (app) => {

	app.get('/admin', (req, res) => {
		res.render('admin-hp.twig', req._cms_data);
	});

	app.get('/admin/login', (req, res) => {

		if (req.session._id) {
			res.redirect('/admin');
			return false;
		}

		models.adminuser.count((err, count) => {

			if (count == 0) {
				res.render('admin-register.twig', req._cms_data);
				return false;
			}

			res.render('admin-login.twig', req._cms_data);

		});

	});

	app.post('/admin/register', (req, res) => {

		models.adminuser.count((err, count) => {

			if (count == 0) {

				const valid = Valid.validate(req, {
					password: 'empty',
					repeatPassword: 'empty',
					email: 'email',
					name: 'empty'
				});

				if (valid !== true) {
					req._cms_data.error = valid.error;
					res.render('admin-register.twig', req._cms_data);
					return false;

				}

				if (req.body.password !== req.body.repeatPassword) {
					req._cms_data.error = 'You didnt correctly repeated password.';
					res.render('admin-register.twig', req._cms_data);
					return false;
				}


				let email = req.body.email.toLowerCase().replace(/ /g, '');

				let newAdmin = new models.adminuser({ name: req.body.name, email });

				let createdPass = newAdmin.createPassword(req.body.password);

				if (createdPass !== true) {
					req._cms_data.error = createdPass.error;
					res.render('admin-register.twig', req._cms_data);
					return false;
				}

				newAdmin.save();

				res.redirect('/admin/login');

			} else res.redirect('/admin-login');

		});

	});

	app.post('/admin/login', (req, res) => {

		const valid = Valid.validate(req, {
			name: 'empty',
			password: 'empty'
		});

		if (valid !== true) {
			req._cms_data.error = valid.error;
			res.render('admin-login.twig', req._cms_data);
			return false;
		}

		models.adminuser.findOne({ name: req.body.name }, (err, user) => {
			if (user !== null && user.password === hash.password(req.body.password, user.salt)) {
				req.session._id = user._id;
				res.redirect('/admin');
			} else {
				req._cms_data.error = 'Wrong user name or password.'
				res.render('admin-login.twig', req._cms_data);
			}
		});
	});

	app.get('/admin/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/admin/login');
	});

	app.post('/admin/logout', (req, res) => {
		req.session.destroy();
	});

	app.get('/admin/show-data/:col/:page?/:category?', (req, res) => {

		let data = req._cms_data;

		if (Valid.isUndefined(models[req.params.col]) || !models[req.params.col].access) {
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('show-data.twig', data);
			return false;
		}

		data.title = `Show - ${req.params.col}s`;
		data.colName = req.params.col;

		const limit = 5;

		pagination(req, data, limit)
			.then(() => {

				res.render('show-data.twig', data);

			});

	});

	app.get('/admin/edit-data/:col/:id', (req, res) => {

		let data = req._cms_data;

		if (Valid.isUndefined(models[req.params.col])) {
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('show-data.twig', data);
			return false;
		}

		models[req.params.col].findOne({ _id: req.params.id }, (err, document) => {
			if (document === null) {
				data.error = 'Document with id ' + req.params.id + ' not found.';
				res.render('show-document.twig', data);
			} else {

				data.title = `Edit - ${req.params.col}`;
				data.structure = models[req.params.col].structure;
				data.document = document.toJSON();
				data.colName = req.params.col;

				if(models[req.params.col].structure.category){

					models.category.find({col : req.params.col}, (err, categories) => {

						data.category = [];

						for (let i = 0; i < categories.length; i++) {
							data.category.push(categories[i].name);
						}

						res.render('admin-edit-data.twig', data);
					});
				} else {
					res.render('admin-edit-data.twig', data);
				}
			}
		});


	});

	app.post('/admin/edit-data/:col/:id', (req, res) => {

		if (Valid.isUndefined(models[req.params.col])) {
			res.json({ error: `${req.params.col} not found.` });
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(Valid.error('You dont have access to this collection'));
			return false;
		}

		models[req.params.col].findOne({ _id: req.params.id }, (err, doc) => {
			if (doc !== null) {

				for (let key in models[req.params.col].structure) {
					doc[key] = req.body[key] || "";
				}

				doc.url = doc.url.trim();

				if (doc.url !== "") {
					doc.url = doc.url.toLowerCase().replace(/ /g, '-');
				} else {
					doc.url = doc._id;
				}

				doc.save();
				res.json({ success: `${req.params.col} has been edited.` });
			} else res.json({ error: `${req.params.col} not found.` });
		});



	})

	app.post('/admin/delete-data/:col/:id', (req, res) => {

		if (Valid.isUndefined(models[req.params.col])) {
			res.json(Valid.error('Collection doesnt exist'));
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(Valid.error('You dont have access to this collection'));
			return false;
		}

		models[req.params.col].findOne({ _id: req.params.id }, (err, document) => {
			if (document === null) res.json({ error: `${req.params.col} not found.` });
			else {
				document.remove();
				res.json({ success: `${req.params.col} has been removed.` });
			}
		});

	});

	app.get('/admin/add-data/:col', (req, res) => {
		
		let data = req._cms_data;

		if (!Valid.isUndefined(models[req.params.col])) {
			data.title = `Add ${req.params.col}`;
			data.structure = models[req.params.col].structure;
			data.colName = req.params.col;

			if(models[req.params.col].structure.category){

				models.category.find({col : req.params.col}, (err, categories) => {

					data.category = [];

					for (let i = 0; i < categories.length; i++) {
						data.category.push(categories[i].name);
					}

					res.render('admin-add-data.twig', data);
				});
			} else {
				res.render('admin-add-data.twig', data);
			}
		} else {
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('admin-add-data.twig', data);
		}

	});

	app.post('/admin/add-data/:col', (req, res) => {

		if (Valid.isUndefined(models[req.params.col])) {
			res.json(Valid.error('Collection doesnt exist'));
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(Valid.error('You dont have access to this collection'));
			return false;
		}

		const data = {};

		for (let key in models[req.params.col].structure) {
			data[key] = req.body[key] || "";
		}

		models.adminuser.findOne({ _id: req.session._id }, (err, author) => {

			if (author !== null) {
				
				data.author = author.name;

				const document = new models[req.params.col](data);

				document.url = data.url.trim();

				if (document.url !== "") {
					document.url = document.url.toLowerCase().replace(/ /g, '-');
				} else {
					document.url = document._id;
				}

				document.save();

				res.json({ success: `${req.params.col} has been added` });
			}

		});

	});

	app.get('/admin/change-password', (req, res) => {
		res.render('admin-change-password.twig', req._cms_data);
	});

	app.post('/admin/change-password', (req, res) => {

		const valid = Valid.validate(req, {
			oldPass: 'empty',
			newPass: 'empty',
			newPassRepeat: 'empty'
		})

		if (valid !== true) {
			res.json(valid);
			return false;
		}

		if (req.body.newPass !== req.body.newPassRepeat) {
			res.json({ error: 'Repeat password correctly' });
			return false;
		}

		models.adminuser.findOne({ _id: req.session._id }, (err, admin) => {

			let changed = admin.changePassword(req.body.oldPass, req.body.newPass);

			if (changed !== true) {
				res.json(changed);
				return false;
			}

			admin.save();
			res.json({ success: 'Password has been changed' });

		});

	});

	app.post('/admin/create-category', (req, res) => {

		const valid = Valid.validate(req, {
			name : 'empty',
			col : 'empty'
		})

		if(valid !== true){
			res.json(valid);
			return false;
		}

		models.category.count({ name : req.body.name }, (err, count) => {
			if(count === 0){

				let category = new models.category({name : req.body.name, col : req.body.col});
				category.save();
				res.json('success');

			} else {
				res.json({error : 'Category already exists'});
			}
		})

	});

};
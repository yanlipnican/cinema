/*
*	
*	Controller for admin
*	
*/


const pagination = (req, data, limit) => {
	return new Promise(resolve => {

		models[req.params.col].count({}, (err, count) => {

			data.pageCount = Math.ceil(count / limit);

			let page = req.params.page - 1 || 0;

			if (page < 0) page = 0;
			if (page >= data.pageCount) page = data.pageCount - 1;

			data.currentPage = page + 1;

			models[req.params.col].find().limit(limit).skip(limit * page).sort({ createdAt: -1 }).exec((err, documents) => {
				data.col = [];
				if (!helper.isUndefined(documents)) {
					for (var i = 0; i < documents.length; i++) {
						data.col.push(documents[i].toJSON());
					}
				}

				resolve();
			});

		});

	});
};


// base data and operations we need every time we get admin page
const get = (app, route, callback) => {
	app.get(route, (req, res) => {

		models.adminuser.findOne({ _id: req.session._id }, (err, admin) => {

			const data = {
				admin: {
					name: admin.name
				}
			};

			data.cols = [];

			for (let key in models) {
				if (models[key].access) data.cols.push(models[key]._name);
			}

			callback(req, res, data);

		});

	});
};
module.exports = (app) => {

	// TODO : add this at beginning of controllers
	// midleware controll session
	app.use('/admin', (req, res, next) => {
		if (req.session._id || req._parsedUrl.path === "/admin/login" || req._parsedUrl.path === "/admin/register") next();
		else {
			res.redirect('/admin/login');
		}
	});

	get(app, '/admin', (req, res, data) => {
		res.render('admin-hp.twig', data);
	});

	app.get('/admin/login', (req, res) => {

		if (req.session._id) {
			res.redirect('/admin');
			return false;
		}

		models.adminuser.count((err, count) => {

			if (count == 0) {
				res.render('admin-register.twig');
				return false;
			}

			res.render('admin-login.twig');

		});

	});

	app.post('/admin/register', (req, res) => {

		models.adminuser.count((err, count) => {

			if (count == 0) {

				const valid = helper.validate(req, {
					password: 'empty',
					repeatPassword: 'empty',
					email: 'email',
					name: 'empty'
				});

				if (valid !== true) {

					res.render('admin-register.twig', valid);
					return false;

				}

				if (req.body.password !== req.body.repeatPassword) {
					res.render('admin-register.twig', { error: 'You didnt correctly repeated password.' });
					return false;
				}


				let email = req.body.email.toLowerCase().replace(/ /g, '');

				let newAdmin = new models.adminuser({ name: req.body.name, email });

				let createdPass = newAdmin.createPassword(req.body.password);

				if (createdPass !== true) {
					res.render('admin-register.twig', createdPass);
					return false;
				}

				newAdmin.save();

				res.redirect('/admin/login');

			} else res.redirect('/admin-login');

		});

	});

	app.post('/admin/login', (req, res) => {

		const valid = helper.validate(req, {
			name: 'empty',
			password: 'empty'
		});

		if (valid !== true) {
			res.render('admin-login.twig', valid);
			return false;
		}

		models.adminuser.findOne({ name: req.body.name }, (err, user) => {
			if (user !== null && user.password === hash.password(req.body.password, user.salt)) {
				req.session._id = user._id;
				res.redirect('/admin');
			} else {
				res.render('admin-login.twig', { error: 'Wrong email or password' });
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

	get(app, '/admin/show-data/:col/:page?', (req, res, data) => {

		if (helper.isUndefined(models[req.params.col]) || !models[req.params.col].access) {
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

	get(app, '/admin/edit-data/:col/:id', (req, res, data) => {

		if (helper.isUndefined(models[req.params.col])) {
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

				res.render('admin-edit-data.twig', data);
			}
		});


	});

	app.post('/admin/edit-data/:col/:id', (req, res) => {

		if (helper.isUndefined(models[req.params.col])) {
			res.json({ error: `${req.params.col} not found.` });
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(helper.error('You dont have access to this collection'));
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

		if (helper.isUndefined(models[req.params.col])) {
			res.json(helper.error('Collection doesnt exist'));
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(helper.error('You dont have access to this collection'));
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

	get(app, '/admin/add-data/:col', (req, res, data) => {
		if (!helper.isUndefined(models[req.params.col])) {
			data.title = `Add ${req.params.col}`;
			data.structure = models[req.params.col].structure;
			data.colName = req.params.col;

			res.render('admin-add-data.twig', data);
		} else {
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('admin-add-data.twig', data);
		}

	});

	app.post('/admin/add-data/:col', (req, res) => {

		if (helper.isUndefined(models[req.params.col])) {
			res.json(helper.error('Collection doesnt exist'));
			return false;
		}

		if (!models[req.params.col].access) {
			res.json(helper.error('You dont have access to this collection'));
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

	get(app, '/admin/change-password', (req, res, data) => {
		res.render('admin-change-password.twig', data);
	});

	app.post('/admin/change-password', (req, res) => {

		const valid = helper.validate(req, {
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

};
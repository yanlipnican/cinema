/*
*	
*	Controller for admin
*	
*/


const pagination = (req, data, limit) => {
	return new Promise((resolve) => {

		models[req.params.col].count({}, (err, count) =>{

			data.pageCount = Math.ceil(count / limit);

			let page = req.params.page - 1 || 0;

			if(page < 0) page = 0;
			if(page >= data.pageCount) page = data.pageCount - 1;

			data.currentPage = page + 1;

			models[req.params.col].find().limit(limit).skip(limit * page).sort({createdAt : -1}).exec((err, documents) => {
				data.col = [];
				for (var i = 0; i < documents.length; i++) {
					data.col.push(documents[i].toJSON());
				}

				resolve();
			});

		});

	});
}


// base data and operations we need every time we get admin page
const get = (app, route, callback) => {
	app.get(route, (req, res) => {
		if(req.session._id){

			models.adminuser.findOne({ _id : req.session._id }, (err, admin) => {
				
				const data = {
					admin: {
						name : admin.name
					}
				};

				data.cols = [];

				for(let key in models){
					if(models[key].access) data.cols.push(models[key]._name);
				}

				callback(req, res, data);

			});

		} else res.redirect('/admin/login');

	});
};

module.exports = (app) => {


	get(app, '/admin', (req, res, data) => {
		res.render('admin-hp.twig', data);
	});

	app.get('/admin/login', (req, res) => {
		if(req.session._id) res.redirect('/admin');
		else res.render('admin-login.twig');
	});

	app.post('/admin/login', (req, res) => {
		if(!helper.isEmpty(req.body.name) && !helper.isEmpty(req.body.password)){
			models.adminuser.findOne({name : req.body.name}, (err, user) =>{
				if(user !== null && user.password === hash.password(req.body.password, user.salt)){
					req.session._id = user._id;
					res.redirect('/admin');
				} else {
					res.render('admin-login.twig', { error : "Wrong email or password"});
				}
			});
		} else {
			res.render('admin-login.twig', {error : 'Fill all inputs.'});
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
		
		if(helper.isUndefined(req.session._id)) res.redirect('/admin/login');
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

	get(app, '/admin/show-data/:col/:page?', (req, res, data) => {

		data.title = `Show - ${req.params.col}`;
		data.colName = req.params.col;

		const limit = 2;

		if(!helper.isUndefined(models[req.params.col]) && models[req.params.col].access){

			pagination(req, data, limit)
				.then(() => {

					res.render('show-data.twig', data);

				});

		} else {
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('show-data.twig', data);
		}
		
	});

	get(app, '/admin/edit-data/:col/:id', (req, res, data) => {

		if(helper.isUndefined(models[req.params.col])){
			data.error = 'Collection ' + req.params.col + ' not found.';
			res.render('show-data.twig', data);
		} else {
			models[req.params.col].findOne({_id : req.params.id}, (err, document) => {
				if(document === null){
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
		}

	});

	app.post('/admin/edit-data/:col/:id', (req, res) => {
		if(req.session._id){
			if(helper.isUndefined(models[req.params.col])) res.json({error : `${req.params.col} not found.`});
			else {

				const data = {};

				for(let key in req.body){
					if(!helper.isUndefined(models[req.params.col].structure[key])){
						data[key] = req.body[key] || "";
					}
				}

				models[req.params.col].findOne({_id : req.params.id}, (err, doc) => {
					if(doc !== null){
						for(let key in req.body){
							if(!helper.isUndefined(models[req.params.col].structure[key])){
								doc[key] = req.body[key] || "";
							}
						}
						doc.save();
						res.json({success : `${req.params.col} has been edited.`});
					} else res.json({error : `${req.params.col} not found.`});
				});

			}
		} else res.json({error : 'no session'});
	})

	app.post('/admin/delete-data/:col/:id', (req, res) => {

		if(helper.isUndefined(req.session._id)) res.json({error : 'no session'});
		else {
			models[req.params.col].findOne({_id : req.params.id}, (err, document) => {
				if(document === null) res.json({error : `${req.params.col} not found.`});
				else {
					document.remove();
					res.json({success : `${req.params.col} has been removed.`});
				}
			});
		}

	});

	get(app, '/admin/add-data/:col', (req, res, data) => {
		if(!helper.isUndefined(models[req.params.col])){
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
		if(helper.isUndefined(req.session._id)) res.redirect('/admin/login');
		else {
			if(!helper.isUndefined(models[req.params.col])){

				const documentData = {};

				for(let key in req.body){
					if(!helper.isUndefined(models[req.params.col].structure[key])){
						documentData[key] = req.body[key] || "";
					}
				}

				models.adminuser.findOne({_id : req.session._id}, (err, author)=>{
					
					if(author !== null){
						documentData.author = author.name;
						const document = new models[req.params.col](documentData);
						document.save();

						res.json({success : `${req.params.col} has been added`});
					}

				});
			}
		}
	});

};
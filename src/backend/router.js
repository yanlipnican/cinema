// router imports all pages from pages directory

import glob from 'glob';

module.exports = (app) => {

	glob(appRoot + "/pages/*.js", (er, files) => {
		
		for (var i = 0; i < files.length; i++) {
			let page = require(files[i]);
			if(typeof(page.get) !== "undefined"){
				app.get(page.route, page.get);
			}
			if(typeof(page.post) !== "undefined"){
				app.post(page.route, page.post);
			}
		}

		app.get('*', (req, res) => {
			res.render('404', {layout : 'blank'});
		});

	});
	
}
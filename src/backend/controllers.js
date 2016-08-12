// router imports all pages from pages directory

import glob from 'glob';

module.exports = (app) => {

	glob(appRoot + "/controllers/*.js", (er, files) => {
		
		for (var i = 0; i < files.length; i++) {
			let controller = require(files[i]);

			controller(app);

		}

		app.get('*', (req, res) => {
			res.render('404', {layout : 'blank'});
		});

	});
	
}
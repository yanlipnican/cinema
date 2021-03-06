// router imports all pages from pages directory

import glob from 'glob';
import path from 'path';

module.exports = (app) => {

	glob(path.resolve(__dirname) + "/controllers/*.js", (er, files) => {
		
		for (var i = 0; i < files.length; i++) {
			let controller = require(files[i]);

			controller(app);

		}

		app.get('*', (req, res) => {
			res.render('404.twig', {layout : 'blank'});
		});

	});
	
}
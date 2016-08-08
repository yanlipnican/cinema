import mongoose from 'mongoose';
import glob from 'glob';

const models = {};

glob(appRoot + "/models/*.js", (er, files) => {
		
	for (var i = 0; i < files.length; i++) {

		let model = require(files[i]);
		models[model.name] = mongoose.model(model.name, model.schema);

	}

});

module.exports = models;
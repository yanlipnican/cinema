import glob from 'glob';
import path from 'path';

const models = {};

glob(path.resolve(__dirname) + "/models/*.js", (er, files) => {
		
	for (var i = 0; i < files.length; i++) {

		let model = require(files[i]);

		model.schema.statics.access = (typeof model.access !== "undefined") ? model.access : true;
		model.schema.statics.plural = (typeof model.plural !== "undefined") ? model.plural : true;
		model.schema.statics._name = model.name;
		model.schema.statics.structure = model.structure;

		models[model.name] = mongoose.model(model.name, model.schema);

	}

});

module.exports = models;
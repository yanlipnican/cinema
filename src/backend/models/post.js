const model = {

	name : 'post',

	schema : mongoose.Schema({
		title : String,
		text  : String,
		author : {type : String, default : 'System'}
	}, {timestamps: true} ),

	// structure for cms to determine which element should be used for
	// property of model
	structure : {
		title : 'input',
		text : 'wysiwyg'
	}

};

module.exports = model;
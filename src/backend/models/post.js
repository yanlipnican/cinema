const model = {

	name : 'post',

	schema : mongoose.Schema({
		title : {type : String, default : ''},
		perex : {type : String, default : ''},
		text  : {type : String, default : ''},
		author : {type : String, default : ''}
	}, {timestamps: true} ),

	// structure for cms to determine which element should be used for
	// property of model
	structure : {
		title : 'input',
		perex : 'wysiwyg',
		text : 'wysiwyg'
	}

};

module.exports = model;
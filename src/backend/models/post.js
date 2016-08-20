const model = {

	name : 'post',

	schema : mongoose.Schema({
		title : {type : String, default : ''},
		perex : {type : String, default : ''},
		text  : {type : String, default : ''},
		author : {type : String, default : ''},
		url : {type : String, default: ''},
		visual : {type : String, default: ''},
		category : {type : String, default: ''}
	}, {timestamps: true} ),

	// structure for cms to determine which input 
	// element should be used for property of model
	
	structure : {
		title : 'input',
		url : 'input',
		category : 'option',
		visual : 'image',
		perex : 'wysiwyg',
		text : 'wysiwyg'
	}

};

module.exports = model;
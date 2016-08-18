const model = {

	name : 'spitFact',

	schema : mongoose.Schema({
		title : {type : String, default : ''},
		text  : {type : String, default : ''},
		author : {type : String, default : ''},
		url : {type : String, default : ''},
		visual : {type : String, default: ''}
	}, {timestamps: true} ),

	// structure for cms to determine which input 
	// element should be used for property of model
	
	structure : {
		title : 'input',
		url : 'input',
		visual : 'image',
		text : 'textarea'
	}

};

module.exports = model;
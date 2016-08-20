const model = {

	name : 'category',

	access : false,
	
	schema : mongoose.Schema({
        	name : String,
        	col : String
	},{timestamps : true})

};

module.exports = model;
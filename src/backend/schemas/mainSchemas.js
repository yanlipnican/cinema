import mongoose from 'mongoose';
let schemas = {

	post : mongoose.Schema({
		title : String,
		text  : String 
	}),

	user : mongoose.Schema({
		name     : String,
		email    : String,
		password : String,
		salt	 : String
	})

}

module.exports = schemas;



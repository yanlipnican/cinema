import mongoose from 'mongoose';
module.exports = {

	post : mongoose.Schema({
		title : String,
		text  : String 
	})

}

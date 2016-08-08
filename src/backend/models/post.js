import mongoose from 'mongoose';

const model = {

	name : 'post',

	schema : mongoose.Schema({
		title : String,
		text  : String
	})

};

module.exports = model;
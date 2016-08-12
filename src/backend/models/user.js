import mongoose from 'mongoose';
import hash from '../hash';

const model = {

	name : 'user',

	access : false,

	schema : mongoose.Schema({
		name     : String,
		email    : String,
		password : String,
		salt	 : String
	})

};

model.schema.methods.exist = function(){
	return new Promise((res, rej) => {

		this.model(model.name).count({email : this.email}, (err, result) => {
			res(result > 0);
		});

	});
}

model.schema.methods.createPassword = function(pass, callback) {
	const hashedPass = hash.createPassword(pass);
	this.password = hashedPass.value;
	this.salt = hashedPass.salt;
}

module.exports = model;
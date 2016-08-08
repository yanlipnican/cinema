import mongoose from 'mongoose';
import hash from '../hash';

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
	}),

	adminUser : mongoose.Schema({
		name     : String,
		email    : String,
		password : String,
		salt	 : String
	})

}

schemas.user.methods.exist = function(callback){
	this.model('user').find({email : this.email}, (err, result) => {
		let exist = result.length > 0;
		callback(exist);
	})
}

schemas.user.methods.createPassword = function(pass, callback) {
	const hashedPass = hash.createPassword(pass);
	this.password = hashedPass.value;
	this.salt = hashedPass.salt;
}

module.exports = schemas;



const model = {

	name : 'adminuser',

	access : false,
	
	schema : mongoose.Schema({
		name     : String,
		email    : String,
		password : String,
		salt	 : String
	},{timestamps : true})

};

model.schema.methods.exist = function(callback){
	this.model(model.name).count({email : this.email}, (err, result) => {
		let exist = result > 0;
		callback(exist);
	})
}

model.schema.methods.createPassword = function(pass, callback) {
	const hashedPass = hash.createPassword(pass);
	this.password = hashedPass.value;
	this.salt = hashedPass.salt;
}

module.exports = model;
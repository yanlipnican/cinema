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

model.schema.methods.exist = function(){
	return new Promise((resolve, reject) => {
		this.model(model.name).count({name : this.name}, (err, result) => {
			if(result > 0){
				resolve(true);
			} else resolve(false);
		});
	});
}

model.schema.methods.createPassword = function(pass) {

	if(pass.length < 6) return {error : "Password has to have at least 6 characters"};
	if(!/\d/.test(pass)) return {error : "Password has to contain number"};

	const hashedPass = hash.createPassword(pass);
	this.password = hashedPass.value;
	this.salt = hashedPass.salt;

	return true;
}

model.schema.methods.changePassword = function(oldPass, newPass) {
	
	let hashOldPass = hash.password(oldPass, this.salt);
	
	if(hashOldPass !== this.password) return {error : 'You entered wrong old password'};

	let created = this.createPassword(newPass);

	if(created !== true) return created;

	return true;

}

module.exports = model;
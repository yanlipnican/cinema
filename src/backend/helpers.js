/*
*	Helper function
*/

module.exports = {

	messages : {
		input : "Fill all inputs.",
		email : "Email is not valid email."
	},

	validateEmail : (email) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	},

	isEmpty : (val) => {
		if(typeof(val) !== "undefined" && val !== ""){
			return false;
		} else return true;
	},

	isUndefined : (val) => {
		if(typeof val === "undefined") return true;
		else return false;
	},

	error : (mes) => {
		return {error : mes};
	},

	validate : function(req, rules) {
		for(let key in rules){

			if(rules[key] === 'empty'){
				
				if(this.isEmpty(req.body[key])){
						
					return this.error(this.messages.input);

				}

			} else if(rules[key] === 'email'){

				if(!this.validateEmail(req.body[key])){

					return this.error(this.messages.email);

				}

			} else if(rules[key] === 'undefined'){

				if(this.isUndefined(req.body[key])){

					return this.error(this.messages.input);

				}

			}
		
		}

		return true;

	},

	getCollection : (data, colections, callback) => {
		
		(function rec(cols){

			let current = cols[0];

			data[current.name + 's'] = [];

			models[current.name].find().limit(current.limit || 999999).sort({createdAt : current.order || -1}).exec((err, documents) => {
				
				for (var i = 0; i < documents.length; i++) {
					data[current.name + 's'].push(documents[i].toJSON());
				}

				cols.shift();

				if(cols.length > 0){
					rec(cols);
				} else {
					callback();
				}

			});

		})(colections);

	}
	
}
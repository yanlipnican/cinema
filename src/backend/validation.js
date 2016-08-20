/*
*	Validation
*/

export const messages = {
	input : "Fill all inputs.",
	email : "Email is not valid email."
}

export const validateEmail = (email) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export const isEmpty = (val) => {
	if(typeof(val) !== "undefined" && val !== ""){
		return false;
	} else return true;
}

export const isUndefined = (val) => {
	if(typeof val === "undefined") return true;
	else return false;
}

export const error = (mes) => {
	return {error : mes};
}

export const validate = (req, rules) => {
	for(let key in rules){

		if(rules[key] === 'empty'){
			
			if(isEmpty(req.body[key])){
					
				return error(messages.input);

			}

		} else if(rules[key] === 'email'){

			if(!validateEmail(req.body[key])){

				return error(messages.email);

			}

		} else if(rules[key] === 'undefined'){

			if(isUndefined(req.body[key])){

				return error(messages.input);

			}

		}
	
	}

	return true;

}
	

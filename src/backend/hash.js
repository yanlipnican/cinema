import crypto from 'crypto'

const genRandomString = (length) =>{
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

const hashPassword = (password, salt) => {
	let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return value;
}

const createPassword = (password) => {
	let salt = genRandomString(16);
	let value = hashPassword(password, salt);
	return {
		value,
		salt
	}
};

module.exports = {
	password : hashPassword,
	createPassword
}
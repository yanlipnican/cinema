import schemas from '../schemas/mainSchemas';
import mongoose from 'mongoose';

module.exports = {
	post 	  : mongoose.model('post', schemas.post),
	adminUser : mongoose.model('adminuser', schemas.user), 
	user      : mongoose.model('user', schemas.user)
}
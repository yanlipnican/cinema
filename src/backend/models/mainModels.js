import schemas from '../schemas/mainSchemas'
import mongoose from 'mongoose';

module.exports = {
	post : mongoose.model('post', schemas.post)
}
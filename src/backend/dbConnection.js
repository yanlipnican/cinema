import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/cinema');

const db = mongoose.connection;

db.once('open', () => {
	console.log('Connected to db');
});

db.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

module.exports = db;
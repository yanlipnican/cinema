import mongoose from 'mongoose';
import config from '../cms-config.json';

let username = config.db.username;
if( username !== ""){
	let password = config.db.password;
	if(password !== ""){
		password = ":" + password;
	}
	username = username + password + '@';
}

mongoose.connect(`mongodb://${username}${config.db.host}:${config.db.port}/${config.db.name}`);

const db = mongoose.connection;

db.once('open', () => {
	console.log(`Connected to DB "${config.db.name}"`);
});

db.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

module.exports = db;
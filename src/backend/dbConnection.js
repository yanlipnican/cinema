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

export const db = mongoose.connection;

db.once('open', () => {
	console.log(`Connected to DB "${config.db.name}"`);
});

db.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

export const getCollection = (data, colections, callback) => {
		
	(function rec(cols){

		let current = cols[0];

		data[current.name + 's'] = [];
		
		models[current.name].find(current.rules || {}).limit(current.limit || null).skip(current.skip || null).sort({createdAt : current.order || -1}).exec((err, documents) => {
			
			for (var i = 0; i < documents.length; i++) {
				data[current.name + 's'].push(documents[i]);
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
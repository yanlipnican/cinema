
const get = (app, route, callback) => {
	
	app.get(route, (req, res) => {
			
		const data = {
			title : config.projectName
		};

		callback(req, res, data);

	});

};

module.exports = (app) => {
	

};
/*
*	404
*/

// some imports
let title = 'Page not found';

const route = '*';

const get = (req, res) => {
	res.render('404', {layout : 'blank'});
}

const post = (req, res) => {
	res.render('404', {layout : 'blank'});
}

module.exports = {
	title,
	route,
	post,
	get
}
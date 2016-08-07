/*
*	Admin logout
*/

// some imports

let title = 'Admin - logout';

const route = '/admin/logout';

const get = (req, res) => {
	req.session.destroy();
	res.redirect('/admin/login');
}

const post = (req, res) => {
	req.session.destroy();
}

module.exports = {
	title,
	route,
	post,
	get
}
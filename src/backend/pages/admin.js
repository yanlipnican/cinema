/*
*	Admin
*/

// some imports

let title = 'Admin';

const route = '/admin';

const get = (req, res) => {
	if(req.session.email) res.render('admin-hp', {layout : 'admin'});
	else res.redirect('/admin/login');
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
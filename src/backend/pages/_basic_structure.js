/*
*	Page name
*/

// some imports
import models from '../models/mainModels';
import hash from '../hash';

let title = 'Page name';

const route = '/page/route';

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
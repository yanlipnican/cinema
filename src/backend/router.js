// import all pages

import admin from './pages/admin';
import adminLogout from './pages/admin-logout';
import adminLogin from './pages/admin-login';

import homepage from './pages/homepage';
import register from './pages/register';
import notFound from './pages/404';

//

module.exports = (app) => {

	const setRoute = (page) => {
		app.get(page.route, page.get);
		app.post(page.route, page.post);
	}

	setRoute(admin);
	setRoute(adminLogout);
	setRoute(adminLogin);
	setRoute(homepage);
	setRoute(register);

	// 404 must always be last route
	setRoute(notFound)

}
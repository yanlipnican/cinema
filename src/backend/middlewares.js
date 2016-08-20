export const middlewares = (app) => {

    app.use('/admin', (req, res, next) => {
        if (req.session._id || req._parsedUrl.path === "/admin/login" || req._parsedUrl.path === "/admin/register") next();
        else {
            res.redirect('/admin/login');
        }
	});

};
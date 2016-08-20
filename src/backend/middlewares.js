export default (app) => {

    // initialize data variable
    app.use('/', (req, res, next) => {
        req._cms_data = {};
        next();
    })

    // admin middleware for basic data
    app.use('/admin', (req, res, next) => {
        if (req.session._id || req._parsedUrl.path === "/admin/login" || req._parsedUrl.path === "/admin/register"){
            models.adminuser.findOne({ _id: req.session._id }, (err, admin) => {        
                
                req._cms_data.admin = admin;
                req._cms_data.cols = [];

                for (let key in models) {
                    if (models[key].access) req._cms_data.cols.push(models[key]._name);
                }

                next();
            });
        }
        else {
            res.redirect('/admin/login');
        }
	});

};
/*

    All midlewares here
    TODO : If here will be more middlewares, then all functions
           will be in separate files, but routes and function
           calls will be here. Or maybe not. We'll see.

*/
export default (app) => {

    // initialize data variable
    app.use('/', (req, res, next) => {
        req._cms_data = {};
        next();
    })

    app.use('/admin', authAdmin);

    app.use('/admin', getAccessableCollections);

    // admin middleware for basic data and session handling
    function authAdmin(req, res, next) {
        req._cms_data.title = "Cinema | Admin";

        if (req.session._id || req._parsedUrl.path === "/admin/login" || req._parsedUrl.path === "/admin/register"){
            models.adminuser.findOne({ _id: req.session._id }, (err, admin) => {                        
                req._cms_data.admin = admin;
                next();
            });
        }
        else {
            res.redirect('/admin/login');
        }
	};

    function getAccessableCollections(req, res, next){
        req._cms_data.cols = [];
        for (let key in models) {
            if (models[key].access) req._cms_data.cols.push(models[key]._name);
        }
        next();
    }

};
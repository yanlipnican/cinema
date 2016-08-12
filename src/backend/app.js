/*
* ----------------------------------
*	Cinema backend by Jan Lipnican
* ----------------------------------
*/

import express from 'express';
import db from './dbConnection';
import controllers from './controllers';
import twig from 'twig';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 6969;

global.appRoot = path.resolve(__dirname);


// Only for devel, if cache is disabled you don't need to restart server
// if you modify twig templates
twig.cache(false);

app.set('view engine', 'twig');
app.set('views', './views')
app.use(session({secret: '1203()*(@(*&#)Haskdjh20', resave: true, saveUninitialized: true}));
app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

controllers(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`);
});
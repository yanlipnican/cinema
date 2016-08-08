/*
* ----------------------------------
*	Cinema backend by Jan Lipnican
* ----------------------------------
*/

import express from 'express';
import db from './dbConnection';
import router from './router';
import handlebars from 'express-handlebars';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 6969;

global.appRoot = path.resolve(__dirname);

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views')
app.use(session({secret: '1203()*(@(*&#)Haskdjh20', resave: true, saveUninitialized: true}));
app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

router(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`);
});
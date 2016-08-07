/*
* ----------------------------------
*	Cinema backend by Jan Lipnican
* ----------------------------------
*/

import express from 'express';
import db from './dbConnection';
import router from './routes/mainRouter';
import handlebars from 'express-handlebars';

const app = express();
const PORT = 6969;

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views')

router(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`);
});
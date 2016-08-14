/*
* ----------------------------------
*	Cinema backend by Jan Lipnican
* ----------------------------------
*/

import express from 'express';
import mongoose from 'mongoose';
import twig from 'twig';
import session from 'express-session';
import busBoy from 'express-busboy';
import favicon from 'serve-favicon';
import fs from 'fs';

import config from '../cms-config.json';
import db from './dbConnection';
import controllers from './controllers';
import twigHelpers from './twigHelpers';
import models from './models';
import helper from './helpers';
import hash from './hash';

global.fs = fs;
global.mongoose = mongoose;
global.models = models;
global.helper = helper;
global.hash = hash;
global.config = config;

global.appRoot = __dirname + '/../';

const app = express();
const PORT = 6969;


// Only for devel, if cache is disabled you don't need to restart server
// if you modify twig templates
twig.cache(false);
twigHelpers(twig);

app.set('view engine', 'twig');
app.set('views', './views')
app.use(session({secret: '1203()*(@(*&#)Haskdjh20', resave: true, saveUninitialized: true}));
app.use(express.static('public'));
busBoy.extend(app, {
	upload: true,
    path: appRoot +'/var/tmp/',
    allowedPath: /./,
    mimeTypeLimit : [
	    'image/jpeg',
	    'image/png'
	]
});

controllers(app);

app.listen(PORT, () => {
	console.log(`Project "${config.projectName}" started.\nListening on port ${PORT}!`);
});
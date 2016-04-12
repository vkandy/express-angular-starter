/**
 * Http server
 */
var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(methodOverride());

/**
 * Mount routes at desired mount paths
 */
var router = express.Router();
router.use('/auth', require('./routes/auth'));
app.use(router);

module.exports = app;
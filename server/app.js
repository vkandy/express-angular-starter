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

app.get('/', function(req, res) {
    res.send('Hello World!');
});

module.exports = app;
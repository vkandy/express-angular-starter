#!/usr/bin/env node
var app  = require('../server/app'),
    http = require('http');

/**
 * Start http server and attach signal handlers.
 */
var server = http.createServer(app);
server.listen(3000, function() {
    console.log('Example app listening on port 3000! \nUse Ctrl+C to shutdown.');
});

process.on('uncaughtException', function(err) {
    console.error('uncaughtException', err);
}).on('SIGINT', function() {
    console.log("Received SIGINT Ctrl+C signal");
    server.close()
}).on('SIGTERM', function() {
    console.log("Received SIGTERM signal");
    server.close()
}).on('exit', function() {
    console.log("Shutting down.");
    server.close()
});

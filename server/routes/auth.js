/**
 * Authentication routes.
 */

var express = require('express'),
    jwt     = require('jsonwebtoken');

var router = express.Router();

/**
 * Use a config file and a secret for HMAC
 * @type {string}
 */
var secretOrPublicKey = 'top secret';

/**
 * How long is this session valid?
 * @type {string}
 */
var expiresIn = '1d';

/**
 * Check username and password
 */
router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    // Use a data store to lookup users
    if(!email || email !== 'test@example.com' || !password || password !== 'password') {
        return res.status(401).send({reason: 'Invalid email or password'}).end();
    }

    jwt.sign({email: email}, secretOrPublicKey, {
        expiresIn: expiresIn
    }, function(token) {
        res.status(201).send({token: token}).end();
    });
});

/**
 * Clear session
 */
router.post('/logout', function(req, res) {
    res.status(200).send({token: ''}).end();
});

module.exports = router;
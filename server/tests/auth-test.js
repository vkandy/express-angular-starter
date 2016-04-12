/**
 * Authentication tests.
 */
var request = require('supertest');

describe('Authentication', function() {

    var server;

    before(function() {
        server = require('../../bin/www');
    });

    after(function() {
        server.close();
    });

    describe('POST /auth/login', function() {

        it('sends 201 authentication is successful', function testSlash(done) {
            request(server)
            .post('/auth/login')
            .send({email: 'test@example.com', password: 'password'})
            .expect(201, done);
        });

        it('sends 401 when authentication fails', function testPath(done) {
            request(server)
            .post('/auth/login')
            .send({email: 'test@example.com', password: ''})
            .expect(401, done);
        });
    });

    describe('POST /auth/login', function() {

        it('sends 200 on logout', function testPath(done) {
            request(server)
            .post('/auth/logout')
            .expect(200, done);
        });
    });
});


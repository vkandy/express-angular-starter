exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    rootElement: '.demo',
    specs: ['client/tests/e2e/*.js'],
    multiCapabilities: [{
        browserName: 'chrome'
    }]
};
/**
 * End to end testing
 */

describe('SigninCtrl', function() {


    beforeEach(function() {
        browser.get('http://localhost:3000/#/signin');
    });

    it('should show page title', function() {
        var greeting = element(by.css('.form-signin-heading'));
        expect(greeting.getText()).toEqual('Please sign in');
    });

    it('should sign in', function() {
        var emailField = element(by.id('email'));
        var passwordField = element(by.id('password'));
        var signinBtn  = element(by.css('.btn-block'));

        emailField.sendKeys('test@example.com');
        passwordField.sendKeys('password');

        expect(emailField.getAttribute('value')).toEqual('test@example.com');
        expect(passwordField.getAttribute('value')).toEqual('password');

        signinBtn.click();

        var dashboardHeader = element(by.css('.page-header'));
        browser.driver.wait(function() {
            return browser.driver.isElementPresent(dashboardHeader);
        }, 5000);
    });

});
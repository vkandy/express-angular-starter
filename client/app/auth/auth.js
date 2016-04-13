'use strict';

angular.module('demo.login', [
    'angular-jwt',
    'angular-storage',
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router'
])

.config(['$httpProvider', '$stateProvider',
    function($httpProvider, $stateProvider) {

        $stateProvider
        .state('signin', {
            parent: 'auth',
            url: '/',
            templateUrl: 'auth/auth.html',
            controller: 'SigninCtrl'
        });
    }
])

.controller('SigninCtrl', ['$scope', '$rootScope', '$http', 'AuthFactory',
    function($scope, $rootScope, $http, AuthFactory) {
    }
]);

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
            url: '/signin',
            templateUrl: 'auth/auth.html',
            controller: 'SigninCtrl'
        })
        .state('signout', {
            parent: 'auth',
            url: '/signout',
            templateUrl: 'auth/auth.html',
            controller: 'SigninCtrl'
        });
    }
])

.controller('SigninCtrl', ['$scope', '$rootScope', '$state', 'AuthFactory',
    function($scope, $rootScope, $state, AuthFactory) {
        $scope.signin = function() {
            AuthFactory.login({
                email: $scope.email,
                password: $scope.password,
                rememberme: $scope.rememberme
            }).then(function() {
                $state.go($rootScope.welcomeState, $rootScope.welcomeStateParams);
            }, function(res) {
                $scope.error = res.status;
            });
        };
    }
]);

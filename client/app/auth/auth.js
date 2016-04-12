'use strict';

angular.module('demo.login', [
    'angular-jwt',
    'angular-storage',
    'ngResource',
    'ui.bootstrap',
    'ui.router'
])

.config(['$httpProvider', '$stateProvider',
    function($httpProvider, $stateProvider) {

        $stateProvider
        .state('loginlayout', {
            abstract: true,
            templateUrl: 'auth/login.html',
            controller: 'LoginLayoutCtrl'
        })
        .state('dashboardlayout', {
            abstract: true,
            templateUrl: 'dashboard/layout.html',
            controller: 'DashboardLayoutCtrl'
        });

        $stateProvider
        .state('login', {
            abstract: true,
            parent: 'loginlayout',
            views: {
                '': {
                    template: '<ui-view></ui-view>'
                }
            },
            data: {
                requiresLogin: false
            }
        })
        .state('dashboard', {
            abstract: true,
            parent: 'dashboardlayout',
            views: {
                'header': {
                    templateUrl: 'dashboard/header.html'
                },
                'menu': {
                    templateUrl: 'dashboard/menu.html'
                },
                '': {
                    template: '<ui-view></ui-view>'
                },
                'footer': {
                    templateUrl: 'dashboard/footer.html'
                }
            },
            data: {
                requiresLogin: true
            }
        });

        $stateProvider
        .state('home', {
            parent: 'dashboard',
            url: '/',
            templateUrl: 'dashboard/home.html',
            controller: 'HomeCtrl'
        });
    }
])

.controller('LoginLayoutCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.bodyClass = 'login';
    }
])
.controller('DashboardLayoutCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', 'AuthFactory',
    function($scope, $rootScope, $state, $window, $http, AuthFactory) {

    }
])
.controller('HomeCtrl', ['$scope', '$rootScope', '$http', 'AuthFactory',
    function($scope, $rootScope, $http, AuthFactory) {
        $scope.profile = AuthFactory.getProfile();

    }
])

/**
 * Factories
 */
.factory('AuthFactory', ['$http', 'store', 'jwtHelper',
    function($http, store, jwtHelper) {

        return {

            isAuthenticated: function() {
                return store.get('demo') && !jwtHelper.isTokenExpired(store.get('demo'));
            },

            login: function(credentials) {
                return $http({
                    method: 'POST',
                    url: '/login',
                    data: credentials,
                    ignore401: true,
                    headers: {'Content-Type': 'application/json'}
                }).then(function(response) {
                    store.set('demo', response.data.token);
                });
            },

            logout: function() {
                return $http({
                    method: 'POST',
                    url: '/logout'
                }).then(function() {
                    store.remove('demo');
                });
            }
        };
    }
]);

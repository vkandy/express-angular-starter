angular.module('demo', [
    'angular-jwt',
    'angular-storage',
    'ngCookies',
    'ngResource',
    'ngMessages',
    'ui.bootstrap',
    'ui.router',
    'demo.login',
    'demo.templates'
])

.run(['$rootScope', '$state', '$stateParams', 'AuthFactory',
    function($rootScope, $state, $stateParams, AuthFactory) {

        $rootScope.$state = $state;
        $rootScope.welcomeState = 'home';
        $rootScope.welcomeStateParams = {};

        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            $rootScope.fromState = fromState;
            $rootScope.fromStateParams = fromStateParams;

            if(!AuthFactory.isAuthenticated() && toState.data.requiresLogin) {
                event.preventDefault();
                $rootScope.welcomeState = toState;
                $rootScope.welcomeStateParams = toStateParams;
            }
        });
    }
])

.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$logProvider', 'jwtInterceptorProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider, $logProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = ['store', function(store) {
            return store.get('STORAGETOKEN');
        }];

        if(!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.interceptors.push('jwtInterceptor');
        $urlRouterProvider.otherwise('/');
        $logProvider.debugEnabled(false);

        $stateProvider
        .state('authlayout', {
            abstract: true,
            templateUrl: 'layouts/auth/layout.html',
            controller: 'AuthLayoutCtrl'
        })
        .state('fluidlayout', {
            abstract: true,
            templateUrl: 'layouts/fluid/layout.html',
            controller: 'FluidLayoutCtrl'
        });

        $stateProvider
        .state('auth', {
            abstract: true,
            parent: 'authlayout',
            views: {
                '': {
                    template: '<ui-view></ui-view>'
                }
            },
            data: {
                requiresLogin: false
            }
        })
        .state('fluid', {
            abstract: true,
            parent: 'fluidlayout',
            views: {
                'header': {
                    templateUrl: 'layouts/fluid/header.html'
                },
                'menu': {
                    templateUrl: 'layouts/fluid/menu.html'
                },
                '': {
                    template: '<ui-view></ui-view>'
                },
                'footer': {
                    templateUrl: 'layouts/fluid/footer.html'
                }
            },
            data: {
                requiresLogin: true
            }
        });
    }
])

.controller('AuthLayoutCtrl', ['$scope', '$http',
    function($scope, $http) {
    }
])
.controller('FluidLayoutCtrl', ['$scope', '$rootScope', '$state',
    function($scope, $rootScope, $state) {
    }
])

/**
 * Factories
 */
.factory('AuthFactory', ['$http', 'store', 'jwtHelper',
    function($http, store, jwtHelper) {

        return {

            isAuthenticated: function() {
                return store.get('STORAGETOKEN') && !jwtHelper.isTokenExpired(store.get('STORAGETOKEN'));
            },

            login: function(credentials) {
                return $http({
                    method: 'POST',
                    url: '/login',
                    data: credentials,
                    headers: {'Content-Type': 'application/json'}
                }).then(function(res) {
                    store.set('STORAGETOKEN', res.data.token);
                });
            },

            logout: function() {
                return $http({
                    method: 'POST',
                    url: '/logout'
                }).then(function() {
                    store.remove('STORAGETOKEN');
                });
            }
        };
    }
]);

angular.module('demo', [
    'angular-jwt',
    'angular-storage',
    'ngResource',
    'ngMessages',
    'ui.bootstrap',
    'ui.router',
    'demo.login'
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
                AuthFactory.clearContexts();
            }
        });
    }
])

.config(['$httpProvider', '$urlRouterProvider', '$logProvider', 'jwtInterceptorProvider',
    function($httpProvider, $urlRouterProvider, $logProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = ['store', function(store) {
            return store.get('demo');
        }];

        if(!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('jwtInterceptor');
        $urlRouterProvider.otherwise('/');
        $logProvider.debugEnabled(false);
    }
]);

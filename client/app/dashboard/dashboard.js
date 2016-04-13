'use strict';

angular.module('demo.dashboard', [
    'ui.bootstrap',
    'ui.router'
])

.config(['$httpProvider', '$stateProvider',
    function($httpProvider, $stateProvider) {

        $stateProvider
        .state('dashboard', {
            parent: 'fluid',
            url: '/',
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }
])

.controller('DashboardCtrl', ['$scope', '$rootScope', 'AuthFactory',
    function($scope, $rootScope, AuthFactory) {

    }
]);

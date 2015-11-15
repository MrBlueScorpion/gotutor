define(function(require){

    'use strict';

    var angular = require('angular');
    var ngRoute = require('angularRoute');

    var app = angular.module('app', ['ngRoute']);

    app.init = function() {
        angular.bootstrap(document, ['app']);
    };

    //app.config([], function($stateProvider, $urlRouterProvider) {
    //
    //    $stateProvider.state('tutors', {
    //        url: '/tutors',
    //        templateUrl: 'home/home.view.html'
    //    })
    //});

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            //$httpProvider.responseInterceptors.push('httpInterceptor');

        $routeProvider
            .when('/', { templateUrl: 'components/home/home.view.html', controller: '' })
            .when('/tutors', { templateUrl: 'components/home/home.view.html', controller: '' })
            .otherwise({ redirectTo: '/' });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        }
    ]);
    return app;
});
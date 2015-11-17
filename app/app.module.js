'use strict';

define(function (require) {

  //vendor libraries
  require('angular');
  require('angular-ui-router');

  // app components
  require('components/home/home.module');
  require('components/tutor/tutor.module');

  var app = angular.module('app', [
    'ui.router',
    'app.home',
    'app.tutor'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'components/home/home.view.html'
      })
      .state('tutors', {
        url : '/tutors',
        templateUrl: 'components/tutor/tutors.view.html'
      })
      .state('about-us', {
        url : '/about-us',
        templateUrl: 'components/about/about.view.html'
      });


    // use the HTML5 History API
    $locationProvider.html5Mode(true);

  }]);

  return app;
});
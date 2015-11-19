'use strict';

define(function (require) {

  //vendor libraries

  // app components
  require('components/home/home.module');
  require('components/tutor/tutor.module');

  var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'toastr',
    'app.home',
    'app.tutor'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'components/home/home.view.html',
          controller : 'HomeController'
        })
        .state('tutors', {
          url : '/tutors',
          templateUrl: 'components/tutor/tutors.view.html'
        })
        .state('about-us', {
          url : '/about-us',
          templateUrl: 'components/about/about.view.html'
        })
        .state('register', {
          url: '/register',
          templateUrl: 'components/tutor/register.view.html'
        })
        .state('register.profile', {
          url: '/profile',
          templateUrl: 'components/tutor/profile.view.html'
        });

      $urlRouterProvider.otherwise('/');

      // use the HTML5 History API
      $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

  app.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      allowHtml: false,
      closeButton: true,
      closeHtml: '<button>&times;</button>',
      extendedTimeOut: 1000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      messageClass: 'toast-message',
      onHidden: null,
      onShown: null,
      onTap: null,
      progressBar: false,
      tapToDismiss: true,
      templates: {
        toast: 'directives/toast/toast.html',
        progressbar: 'directives/progressbar/progressbar.html'
      },
      timeOut: 5000,
      titleClass: 'toast-title',
      toastClass: 'toast'
    });
  });

  return app;
});
'use strict';

define(function (require) {

  //vendor libraries
  require('angular-ui-router');
  require('angular-animate');
  require('angular-toastr');
  require('angular-sanitize');
  require('ng-file-upload');
  require('angular-bootstrap-select');
  require('angular-ui-select');
  require('angular-bootstrap-checkbox');
  require('angular-cookies');

  // app components
  require('components/home/home.module');
  require('components/tutor/tutor.module');

  var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'toastr',
    'ngFileUpload',
    'angular-bootstrap-select',
    'ui.select',
    'ui.checkbox',
    'ngSanitize',
    'ngCookies',
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
        .state('tutor', {
          url: '/tutor/:tutorId',
          templateUrl: 'components/tutor/tutor.view.html',
          controller: 'TutorController',
          resolve: {
            tutorId : ['$stateParams', function($stateParams) {
              return $stateParams.tutorId;
            }]
          }
        })
        .state('register', {
          url: '/register',
          templateUrl: 'components/tutor/register.view.html',
          controller : 'RegisterController'
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'components/tutor/profile.view.html',
          controller : 'ProfileController',
          data : {
            requireLogin : true
          }
        })
        .state('messages', {
          url : '/messages',
          templateUrl : 'components/tutor/messages.view.html'
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

  app.run(['$rootScope', '$state', 'AuthenticateService', 'toastr', '$cookieStore',
    function($rootScope, $state, AuthenticateService, toastr, $cookieStore) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(('data' in toState) && toState.data.requireLogin && _.isUndefined($cookieStore.get('currentUser'))) {
        $rootScope.error = "You need to login first";
        toastr.error($rootScope.error,'Error');
        event.preventDefault();
        $state.go('register');
      }
      //else if(fromState.url === '^') {
      //  if(AuthenticateService.isLoggedIn()) {
      //    $state.go('home');
      //  } else {
      //    $rootScope.error = null;
      //    $state.go('anon.login');
      //  }
      //}
    });
  }]);

  return app;
});
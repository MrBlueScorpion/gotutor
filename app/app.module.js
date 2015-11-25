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
  var TutorApiService = require('shared/services/api/tutor.service'),
      AuthService = require('shared/services/api/auth.service'),
      SessionService = require('shared/services/api/session.service');

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

  app.service('TutorApiService', TutorApiService)
     .service('AuthService', AuthService)
     .service('SessionService', SessionService);


  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'toastrConfig', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, toastrConfig, $httpProvider) {
      //ui-router configuration


      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'components/home/home.view.html',
          controller : 'HomeController',
          data : {
            requireLogin : false
          }
        })
        .state('tutors', {
          url : '/tutors',
          templateUrl: 'components/tutor/tutors.view.html',
          data : {
            requireLogin : false
          }
        })
        .state('about-us', {
          url : '/about-us',
          templateUrl: 'components/about/about.view.html',
          data : {
            requireLogin : false
          }
        })
        .state('tutor', {
          url: '/tutor/:tutorId',
          templateUrl: 'components/tutor/tutor.view.html',
          controller: 'TutorController',
          resolve: {
            tutorId : ['$stateParams', function($stateParams) {
              return $stateParams.tutorId;
            }]
          },
          data : {
            requireLogin : false
          }
        })
        .state('register', {
          url: '/register',
          templateUrl: 'components/auth/register.view.html',
          controller : 'RegisterController'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'components/auth/login.view.html',
          controller : 'LoginController'
        })
        .state('user', {
          abstract : true,
          templateUrl : 'components/user/user.view.html',
          data : {
            requireLogin : true
          }
        })
        .state('user.profile', {
          url: '/profile',
          templateUrl: 'components/user/profile.view.html',
          controller : 'ProfileController'
        })
        .state('user.messages', {
          url : '/messages',
          templateUrl : 'components/user/messages.view.html'
        });

      $urlRouterProvider.otherwise('/');

      // use the HTML5 History API
      $locationProvider.html5Mode(true).hashPrefix('!');

      //angular toast configuration
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

      //session expiry configuration
      $httpProvider.interceptors.push(['$q','$location', function($q, $location) {
        return {
          'responseError': function(response) {
            if(response.status === 401 || response.status === 403) {
              $location.path('/login');
            }
            return $q.reject(response);
          }
        };
      }]);

  }]);


  app.run(['$rootScope', '$state', 'AuthService', 'SessionService', 'toastr',
    function($rootScope, $state, AuthService, SessionService, toastr) {

      $rootScope.auth = AuthService;
      $rootScope.session = SessionService;

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if(('data' in toState) && toState.data.requireLogin && !AuthService.isLoggedIn()) {
          $rootScope.error = "You need to login first";
          toastr.error($rootScope.error,'Error');
          event.preventDefault();
          $state.go('login');
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
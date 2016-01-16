'use strict';

//vendor libraries
require('angular-ui-router');
require('angular-animate');
require('angular-toastr');
require('angular-sanitize');
require('ng-file-upload');
require('angular-bootstrap-select');
require('ui-select');
require('angular-bootstrap-checkbox');
require('angular-cookies');
require('angular-bootstrap');

// app components
require('./components/home/home.module');
require('./components/tutor/tutor.module');

require('./angular-templates')
var TutorApiService = require('./shared/services/api/tutor.service'),
    AuthService = require('./shared/services/api/auth.service')

var SliderDirective = require('./shared/directives/slider.directive');

var app = angular.module('app', [
  'ui.router',
  'ngAnimate',
  'toastr',
  'ngFileUpload',
  'angular-bootstrap-select',
  'ui.select',
  'ui.checkbox',
  'ui.bootstrap',
  'ngSanitize',
  'ngCookies',
  'templateCache',
  'app.home',
  'app.tutor'
]);

app.service('TutorApiService', TutorApiService)
    .service('AuthService', AuthService)
    .directive('slider', SliderDirective);


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
        url : '/tutors?subject&subjectids&geohash&location&gender&page',
        templateUrl: 'components/tutor/tutors.view.html',
        controller: 'TutorsListController',
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
        templateUrl : 'components/user/messages.view.html',
        controller : 'MessageController'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'components/404/404.html',
        controller : 'ErrorController'
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

    $httpProvider.defaults.withCredentials = true;

}]);


app.run(['$rootScope', '$state', 'AuthService', 'toastr',
  function($rootScope, $state, AuthService, toastr) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(('data' in toState) && toState.data.requireLogin) {
        AuthService.isLoggedIn().then(function(user) {
          $rootScope.auth = AuthService;
          if (angular.isDefined(user.id)) {
            $rootScope.isLoggedIn = true;
            $rootScope.currentUser = user;
          } else {
            $rootScope.isLoggedIn = false;
            $rootScope.currentUser = null;
            $rootScope.error = "You need to login first";
            toastr.error($rootScope.error,'Error');
            event.preventDefault();
            $state.go('login');
          }
        });
      }

     //if($rootScope.isLoggedIn) {
     //  $state.go('user.profile');
     //} else {
     //  $state.go('home');
     //}

    });
}]);

module.exports = app;
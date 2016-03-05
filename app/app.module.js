'use strict';

//vendor libraries
require('angular-ui-router');
require('angular-animate');
require('angular-messages');
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
require('./angular-templates');

var TutorApiService = require('./shared/services/api/tutor.service'),
    AuthService = require('./shared/services/api/auth.service'),
    TestService = require('./shared/services/api/test.service');

var SliderDirective = require('./shared/directives/slider.directive');
var CompareToDirective = require('./shared/directives/compareto.directive');

var HighlightFilter = require('./shared/filters/highlight.filter'),
    Nl2brFilter = require('./shared/filters/nl2br.filter');

var app = angular.module('app', [
  'ui.router',
  'ngAnimate',
  'ngMessages',
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
   .service('TestService', TestService)
   .directive('slider', SliderDirective)
   .directive('compareTo', CompareToDirective)
   .filter('highlight', HighlightFilter)
   .filter('nl2br', Nl2brFilter);

app.constant('AUTH_EVENTS', {
  loginSuccess : 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
  .constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  tutor: 'tutor',
  user: 'user'
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    };
  });

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'toastrConfig', '$httpProvider', 'USER_ROLES',
  function ($stateProvider, $urlRouterProvider, $locationProvider, toastrConfig, $httpProvider, USER_ROLES) {

    //ui-router configuration
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'components/home/home.html',
        controller : 'HomeController'
      })
      .state('tutors', {
        url : '/tutors?keywords&subjectids&locationid&location&gender&page&test',
        templateUrl: 'components/tutor/tutors.html',
        controller: 'TutorsListController'
      })
      .state('about-us', {
        url : '/about-us',
        templateUrl: 'components/about/about.html',
        controller: 'AboutController'
      })
      .state('tutor', {
        url: '/tutor/:tutorId',
        templateUrl: 'components/tutor/tutor.html',
        controller: 'TutorController',
        resolve: {
          tutorId : ['$stateParams', function($stateParams) {
            return $stateParams.tutorId;
          }]
        }
      })
      .state('register', {
        url: '/register?test',
        templateUrl: 'components/auth/register.html',
        controller : 'RegisterController'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'components/auth/login.html',
        controller : 'LoginController'
      })
      .state('user', {
        abstract : true,
        templateUrl : 'components/user/user.html',
        data : {
          authorizedRoles: [USER_ROLES.tutor]
        }
      })
      .state('user.profile', {
        url: '/profile',
        templateUrl: 'components/user/profile.html',
        controller : 'ProfileController'
      })
      .state('user.enquiries', {
        url : '/enquiries',
        templateUrl : 'components/user/enquiries.html',
        controller : 'EnquiryController'
      })
      .state('user.account', {
        url : '/account',
        templateUrl : 'components/user/account.html',
        controller : 'AccountController'
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
    $httpProvider.interceptors.push('AuthInterceptor');

    $httpProvider.defaults.withCredentials = true;

}]);


app.run(['$rootScope', '$state', 'AuthService', 'toastr', 'AUTH_EVENTS',
  function($rootScope, $state, AuthService, toastr, AUTH_EVENTS) {

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {

    });


    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(event) {

    });

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      $rootScope.currentUser = null;
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      AuthService.isAuthenticated().then(function(response) {
        $rootScope.auth = AuthService;
        if (response.user) {
          $rootScope.currentUser = response.user;
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        } else {
          if(('data' in toState) && toState.data.authorizedRoles) {
            //toastr.error("You need to login first");
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            $state.go('login');
            event.preventDefault();
          }
        }
      });
      if (toParams.test) toastr.warning('Test mode!');
    });
}]);

module.exports = app;
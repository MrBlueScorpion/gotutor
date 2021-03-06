'use strict';

//vendor libraries
require('angular-ui-router');
require('angular-animate');
require('angular-messages');
require('angular-toastr');
require('angular-sanitize');
require('ui-select');
require('angular-bootstrap-checkbox');
require('angular-cookies');
require('angular-bootstrap');
require('angular-file-upload');
require('ng-img-crop-full-extended');

// app components
require('./components/home/home.module');
require('./components/tutor/tutor.module');
require('./angular-templates');

var TutorApiService = require('./services/tutor'),
    AuthService = require('./services/auth'),
    TestService = require('./services/test');

var SliderDirective = require('./directives/common/slider'),
    CompareToDirective = require('./directives/common/compareTo'),
    GtLoadDirective = require('./directives/common/gtLoad'),
    GtActionDirective = require('./directives/common/gtAction'),
    TutorShowPhoneNumber = require('./directives/tutor/showPhoneNumber'),
    TutorDetail = require('./directives/tutor/tutorDetail'),
    TutorImage = require('./directives/common/tutorImage'),
    UserUploadPhoto = require('./directives/user/uploadPhoto');

var HighlightFilter = require('./shared/filters/highlight.filter');

var app = angular.module('app', [
  'ui.router',
  'ngAnimate',
  'ngMessages',
  'toastr',
  'angularFileUpload',
  'ui.select',
  'ui.checkbox',
  'ui.bootstrap',
  'ngSanitize',
  'ngCookies',
  'templateCache',
  'app.home',
  'app.tutor',
  'ngImgCrop'
]);

app.service('TutorApiService', TutorApiService)
    .service('AuthService', AuthService)
    .service('TestService', TestService)
    .directive('slider', SliderDirective)
    .directive('compareTo', CompareToDirective)
    .directive('gtLoad', GtLoadDirective)
    .directive('gtAction', GtActionDirective)
    .directive('showPhoneNumber', TutorShowPhoneNumber)
    .directive('tutorDetail', TutorDetail)
    .directive('tutorImage', TutorImage)
    .directive('uploadPhoto', UserUploadPhoto)
    .filter('highlight', HighlightFilter);

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
        url : '/tutors?page&test',
        templateUrl: 'components/tutor/tutors.html',
        controller: 'TutorsListController'
      })
      .state('tutors-param1', {
        url : '/tutors/:param1?page&test',
        templateUrl: 'components/tutor/tutors.html',
        controller: 'TutorsListController'
      })
      .state('tutors-param2', {
        url : '/tutors/:param1/:param2?page&test',
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
        url: '/register?test&link',
        views: {
          '': {
            templateUrl: 'components/auth/register.html',
            controller : 'RegisterController'
          },
          'partial@register': {
            templateUrl: 'components/auth/login.partial.html'
          }
        }

      })
      .state('login', {
        url: '/login',
        views: {
          '': {
            templateUrl: 'components/auth/login.html',
            controller : 'LoginController'
          },
          'partial@login': {
            templateUrl: 'components/auth/login.partial.html'
          }
        }

      })
      .state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: 'components/auth/forgotpassword.html',
        controller : 'LoginController'
      })
      .state('resetpassword', {
        url: '/resetpassword/:link',
        templateUrl: 'components/auth/resetpassword.html',
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
        url : '/account?test',
        templateUrl : 'components/user/account.html',
        controller : 'AccountController'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'components/404/404.html',
        controller : 'ErrorController'
      });

    $urlRouterProvider.otherwise('/404');

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

    $httpProvider.defaults.withCredentials = true;

}]);


app.run(['$rootScope', '$state', '$document', '$cookies', 'AuthService', 'toastr', 'AUTH_EVENTS',
  function($rootScope, $state, $document, $cookies, AuthService, toastr, AUTH_EVENTS) {

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function(ev) {
      $state.go('login');
      ev.preventDefault();
    });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(ev, user) {
      $cookies.put('GT_USER', user.id, {
        path: '/',
        domain: '.gotute.com',
        expires: '9999-12-31T23:59:59.000Z'
      });
      $rootScope.currentUser = user;
    });

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(ev, toState) {
      $rootScope.currentUser = null;
      $cookies.remove('GT_USER', {
        path: '/',
        domain: '.gotute.com'
      });
      if (
        (toState && toState.data && toState.data.authorizedRoles) ||
        ($state.current.data && $state.current.data.authorizedRoles)) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized)
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      $document.find('#navbar').removeClass('in');
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.showClassification = $state.is('home');

      if (toParams.test) toastr.warning('Test mode!');
      
      AuthService.isAuthenticated().then(function(user) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      }, function(e) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, toState);
      });
      
    });
    
    $rootScope.logoutUser = function() {
      AuthService.logoutUser()
    }
}]);

module.exports = app;
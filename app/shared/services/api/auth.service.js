'use strict';

define(function(require){

  var utility = require('shared/helpers/utility');

  return ['$q', '$http', '$cookieStore', '$rootScope', 'SessionService',
    function ($q, $http, $cookieStore, $rootScope, SessionService) {

    var registerUser = function(email, password) {
      var deferred = $q.defer();
      var url = utility.generateApiUrl('users/register');

      $http({
        method: 'POST',
        url : url,
        data : {
          email : email,
          password : password
        }
      }).success(function(response) {
        SessionService.setUser(response);
        deferred.resolve({success: response});
      }).error(function(response){
        deferred.resolve({error: 'Unexpected error, please try again'})
      });

      return deferred.promise;
    };

    var isLoggedIn = function() {
      return SessionService.getUser() != null;
    };

    var loginUser = function(email, password) {
      var deferred = $q.defer(),
          url = utility.generateApiUrl('users/login');

      $http({
        method : 'POST',
        url : url,
        data : {
          email : email,
          password : password
        }
      }).success(function(response) {
        console.log(response);
        SessionService.setUser(response);
        deferred.resolve({success: response});
      }).error(function(response) {
        deferred.resolve({error: 'Unexpected error, please try again'})
      });

      return deferred.promise;
    };


    var logoutUser = function() {
      var url = utility.generateApiUrl('users/logout');

      $http({
        method : 'POST',
        url : url
      }).then(function(response) {
        SessionService.destroy();
      });
    };

    var getUserProfile = function() {
      var deferred = $q.defer();

      
    };

    return {
      registerUser : registerUser,
      isLoggedIn : isLoggedIn,
      loginUser : loginUser,
      logoutUser : logoutUser
    }

  }];

});


'use strict';

var utility = require('../../helpers/utility');

module.exports = ['$q', '$http', '$rootScope', 'AUTH_EVENTS', function ($q, $http, $rootScope, AUTH_EVENTS) {
  var currentUser;

  /**
   * Register a user
   * @param email
   * @param password
   * @returns {*}
   */
  var registerUser = function(email, password) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/register');

    $http.post(url, {
      email: email,
      password: password
    }).then(function (response) {
      currentUser = response.data;
      deferred.resolve({user: currentUser});
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function (response) {
      currentUser = null;
      deferred.resolve({error: response.data.displayMessage, user: currentUser})
    });

    return deferred.promise;
  };

  /**
   * Check if a user has logged in
   * @returns {*}
   */
  var isAuthenticated = function() {
    var deferred = $q.defer();
    
    if (currentUser) {
      deferred.resolve({user: currentUser});
    } else {

      var url = utility.generateApiUrl('users/me');
      $http.get(url).then(function(response) {
        currentUser = response.data;
        deferred.resolve({user: currentUser});
      }, function() {
        deferred.resolve({user: null});
      });
    }
    
    return deferred.promise;
  };

/*
  var isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    //return (this.isAuthenticated() &&
    //authorizedRoles.indexOf(Session.userRole) !== -1);
  };
*/
  /**
   * User log in
   *
   * @param email
   * @param password
   * @returns {*}
   */
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
    }).then(function(response) {

      currentUser = response.data;
      console.log(currentUser);
      deferred.resolve({user: currentUser});
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function(response) {
      currentUser = null;
      deferred.resolve({error: 'Unexpected error happened!'});
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });

    return deferred.promise;
  };

  /**
   * User log out
   * @returns {*}
   */
  var logoutUser = function() {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/logout');

    $http.get(url).then(function(response) {
      currentUser = null;
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    });
  };



  return {
    registerUser : registerUser,
    isAuthenticated : isAuthenticated,
    loginUser : loginUser,
    logoutUser : logoutUser
    //isAuthorized : isAuthorized,
    //getTutorProfile: getTutorProfile
  }

}];
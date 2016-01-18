'use strict';

var utility = require('../../helpers/utility');

module.exports = ['$q', '$http', '$rootScope', 'AUTH_EVENTS', function ($q, $http, $rootScope, AUTH_EVENTS) {
  var _isLoggedIn = false;
  var currentUser = null;

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
      _isLoggedIn = true;
      deferred.resolve(response.data);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function (response) {
      _isLoggedIn = false;
      deferred.resolve({error: 'Unexpected error happened!'})
    });

    return deferred.promise;
  };

  /**
   * Check if a user has logged in
   * @returns {*}
   */
  var isAuthenticated = function() {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/me');

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
      _isLoggedIn = true;
    }, function() {
      _isLoggedIn = false;
      deferred.resolve(_isLoggedIn);
    });

    return deferred.promise;
  };

  var isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    //return (this.isAuthenticated() &&
    //authorizedRoles.indexOf(Session.userRole) !== -1);
  };

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
      _isLoggedIn = true;
      deferred.resolve(response.data);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function(response) {
      _isLoggedIn = false;
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
      _isLoggedIn = false;
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    }, function(response) {
      _isLoggedIn = true;
    });


    return _isLoggedIn;
  };

  /**
   * Get User profile
   *
   * @returns {*}
   */
  var getUserProfile = function() {
    var deferred = $q.defer();

    
  };

  return {
    registerUser : registerUser,
    isAuthenticated : isAuthenticated,
    loginUser : loginUser,
    logoutUser : logoutUser,
    isAuthorized : isAuthorized
  }

}];
'use strict';

var config = require('../../../app.constant');

module.exports = ['$q', '$http', '$rootScope', 'AUTH_EVENTS', 'TestService', function ($q, $http, $rootScope, AUTH_EVENTS, TestService) {
  var currentUser;

  /**
   * Register a user
   * @param email
   * @param password
   * @returns {*}
   */
  var registerUser = function(email, password) {
    var deferred = $q.defer();
    var url = config.TUTOR_API + 'users/register';
    var test = TestService.getTest();
    if (test) url += '?test=' + test;
    
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

      var url = config.TUTOR_API + 'users/me';
      $http.get(url).then(function(response) {
        currentUser = response.data;
        deferred.resolve({user: currentUser});
      }, function() {
        deferred.resolve({user: null});
      });
    }
    
    return deferred.promise;
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
        url = config.TUTOR_API + 'users/login';

    $http({
      method : 'POST',
      url : url,
      data : {
        email : email,
        password : password
      }
    }).then(function(res) {
      currentUser = res.data;
      console.log(currentUser);
      deferred.resolve({user: currentUser});
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function(res) {
      currentUser = null;
      if (res.status == 401) deferred.resolve({error: 'Invalid username or password. Please try again.'});
      else deferred.resolve({error: 'Server error, please try again later.'});
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });

    return deferred.promise;
  };

  /**
   * User log out
   * @returns {*}
   */
  var logoutUser = function() {
    var url = config.TUTOR_API + 'users/logout';

    $http.get(url).then(function(response) {
      currentUser = null;
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    });
  };

  var setDisplayName = function(name) {
    currentUser && (currentUser.displayName = name)
  };
  
  return {
    registerUser : registerUser,
    isAuthenticated : isAuthenticated,
    loginUser : loginUser,
    logoutUser : logoutUser,
    setDisplayName: setDisplayName
  }

}];
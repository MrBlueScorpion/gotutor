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
    var url = config.TUTOR_API + 'users/register';
    var test = TestService.getTest();
    if (test) url += '?test=' + test;
    
    return $http.post(url, {
      email: email,
      password: password
    }).then(function (res) {
      currentUser = res.data;
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      return { user: currentUser };
    }, function (res) {
      currentUser = null;
      return $q.reject(res.data && res.data.displayMessage || 'Server error, please try again')
    });
  };

  var registerUserWithLink = function(email, password, link) {
    var url = config.TUTOR_API + 'users/registerlink/' + link;
    var test = TestService.getTest();
    if (test) url += '?test=' + test;
    
    return $http.post(url, {
      email: email,
      password: password
    }).catch(function (res) {
      currentUser = null;
      return $q.reject(res.data && res.data.displayMessage || 'Server error, please try again')
    });
  };
  /**
   * Check if a user has logged in
   * @returns {*}
   */
  var isAuthenticated = function() {
    if (angular.isDefined(currentUser)) {
      return currentUser ? $q.resolve(currentUser) : $q.reject();
    } else {
      var url = config.TUTOR_API + 'users/me';
      return $http.get(url).then(function(response) {
        currentUser = response.data;
        return currentUser;
      }, function(e) {
        return $q.reject(e);
      });
    }
  };

  /**
   * User log in
   *
   * @param email
   * @param password
   * @returns {*}
   */
  var loginUser = function(email, password) {
    var url = config.TUTOR_API + 'users/login';

    return $http({
      method : 'POST',
      url : url,
      data : {
        email : email,
        password : password
      }
    }).then(function(res) {
      currentUser = res.data;
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      return currentUser;
    }, function(res) {
      currentUser = null;
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      if (res.status == 401) return $q.reject('Invalid username or password. Please try again.');
      return $q.reject('Server error, please try again later.');
    });
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
  }
  
  var changePassword = function(oldPassword, password) {
    var url = config.TUTOR_API + 'users/updatepassword';

    return $http.post(url, {
      oldPassword: oldPassword,
      password: password
    }).catch(function(e) {
      return (e.status == 401) ? 
      $q.reject('Incorrect old password. Please try again.') : 
      $q.reject(e.data && e.data.displayMessage || 'Server error. Please try again later.')
    });
  }
  
  var forgotPassword = function(email) {
    var url = config.TUTOR_API + 'users/forgotpassword';

    return $http.post(url, {
      email: email
    }).catch(function(e) {
      return (e.status == 404) ? 
      $q.reject('User not found.') : 
      $q.reject(e.data && e.data.displayMessage || 'Server error. Please try again later.')
    });
  }
  
  var resetPassword = function(link, password) {
    var url = config.TUTOR_API + 'users/updatepassword?link=' + link;

    return $http.post(url, {
      password: password
    }).catch(function(e) {
      return (e.status == 401) ? 
      $q.reject('This link to reset your password has expired.') : 
      'Server error. Please try again later.'
    });
  }
  
  var deleteAccount = function() {
    var url = config.TUTOR_API + 'users/me';
    var test = TestService.getTest();
    if (test) url += '?test=' + test;
    return $http.delete(url).then(function(response) {
      currentUser = null;
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    }, function(e) {
      return $q.reject('Server error. Please try again later.');
    });
  };

  var getCurrentUser = function() {
    return currentUser;
  }
  
  return {
    registerUser : registerUser,
    registerUserWithLink: registerUserWithLink,
    isAuthenticated : isAuthenticated,
    loginUser : loginUser,
    logoutUser : logoutUser,
    setDisplayName: setDisplayName,
    changePassword: changePassword,
    deleteAccount: deleteAccount,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    getCurrentUser: getCurrentUser
  }

}];
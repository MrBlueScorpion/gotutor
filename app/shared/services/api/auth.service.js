'use strict';

var utility = require('../../helpers/utility');

module.exports = ['$q', '$http', function ($q, $http) {
  var _isLoggedIn;
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
      _isLoggedIn = true;
      deferred.resolve({success: response});
    }, function (response) {
      _isLoggedIn = false;
      deferred.resolve({error: 'Unexpected error, please try again'})
    });

    return deferred.promise;
  };

  /**
   * Check if a user has logged in
   * @returns {*}
   */
  var isLoggedIn = function() {
    if (typeof(_isLoggedIn) !== 'undefined')
      return _isLoggedIn;
      
    var url = utility.generateApiUrl('users/me');

    $http.get(url).then(function(response) {
      _isLoggedIn = true;
      currentUser = response.data;
    }, function() {
      _isLoggedIn = false;
    });

    return _isLoggedIn;
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
      deferred.resolve({success: response});
    }, function(response) {
      _isLoggedIn = false;
      deferred.resolve({error: 'Unexpected error, please try again'})
    });

    return deferred.promise;
  };

  /**
   * User log out
   * @returns {*}
   */
  var logoutUser = function() {
    var url = utility.generateApiUrl('users/logout');

    $http.get(url).then(function(response) {
      _isLoggedIn = false;
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
    isLoggedIn : isLoggedIn,
    loginUser : loginUser,
    logoutUser : logoutUser,
    _isLoggedIn : _isLoggedIn
  }

}];
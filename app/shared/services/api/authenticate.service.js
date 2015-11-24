'use strict';

define(function(require){

  var utility = require('shared/helpers/utility');

  return ['$q', '$http', '$cookieStore', '$rootScope', function ($q, $http, $cookieStore, $rootScope) {

    var currentUser = $cookieStore.get('user') || {id : ''};

    var assignCurrentUser = function(user) {
      $rootScope.currentUser = user;
      return user;
    };

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
      }).then(function(response) {
        if (!_.isUndefined(response.data)) {
          assignCurrentUser(response.data);
          $cookieStore.put('currentUser', response.data);
          deferred.resolve({success: response.data});
        } else {
          deferred.resolve({error: 'Unexpected error, please try again'})
        }

      });

      return deferred.promise;
    };

    var isLoggedIn = function(user) {
      if (isUndefined(user)) {
        user = currentUser
      }

      return user;
    };


    var loginUser = function(email, password) {


    };


    var logoutUser = function() {
      var deferred = $q.defer();
      var url = utility.generateApiUrl('users/logout');

      $http({
        method : 'POST',
        url : url
      });
    };
    return {
      registerUser : registerUser,
      isLoggedIn : isLoggedIn,
      user : currentUser
    }




  }];

});


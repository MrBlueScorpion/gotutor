'use strict';

define(function(require) {

  var utility = require('shared/helpers/utility');

  return ['$q', '$http', function ($q, $http) {

    var getRecommendedTutors = function () {

      var deferred = $q.defer();
      var url = utility.generateQueryUrl('recommend');

      $http({
        method : 'GET',
        url : url
      }).then(function(response){

          if (!_.isUndefined(response.data)) {
            deferred.resolve(response.data);
          }

      });

      return deferred.promise;
    };

    var getTutorsByLocation = function(location) {

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
          deferred.resolve({success: response.data});
        } else {
          deferred.resolve({error: 'Unexpected error, please try again'})
        }

      });

      return deferred.promise;
    };


    return {
      getRecommendedTutors : getRecommendedTutors,
      getTutorsByLocation : getTutorsByLocation,
      registerUser : registerUser
    }




  }];
});
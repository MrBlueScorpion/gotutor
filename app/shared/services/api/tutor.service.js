'use strict';

define(function(require) {

  var utility = require('shared/helpers/utility');

  return ['$q', '$http', function ($q, $http) {

    var getRecommendedTutors = function () {

      var deferred = $q.defer();
      var url = utility.generateQueryUrl('recommend');

      $http.get(url).then(function(response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    };

    var getTutorsByLocation = function(location) {

    };


    return {
      getRecommendedTutors : getRecommendedTutors,
      getTutorsByLocation : getTutorsByLocation
    }




  }];
});
'use strict';

define(function(require) {

  var utility = require('shared/helpers/utility');

  var getTutorsCanceler;

  return ['$q', '$http', function ($q, $http) {

    var getRecommendedTutors = function () {

      var deferred = $q.defer();
      var url = utility.generateUrl('recommend');

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

    var getTutorsByQuery = function (query) {
      if (getTutorsCanceler) getTutorsCanceler.resolve();
      getTutorsCanceler = $q.defer();
      var deferred = $q.defer();
      var url = utility.generateUrl('search');
      //process query and generate url
      //console.log(query);
      if (query.subjectids && query.subjectids.length > 0) {
        //got subjectids, do not use keywords
        for (var i = 0; i < query.subjectids.length; i++) {
          url += (i == 0) ? '?subjectids=' + query.subjectids[i] : '&subjectids=' + query.subjectids[i];
        }
      } else {
        //use keywords
        url += '?keywords=' + query.keywords;
      }
      if (query.geohash && query.range) {
        //use geohash
        url += '&geohash=' + query.geohash + '&range=' + query.range;
      } else {
        //use location
        url += '&location=' + query.location;
      }
      url += '&gender=' + query.gender + '&page=' + query.page + '&pagesize=' + query.pageSize;
      $http({
        method: 'GET',
        url: url,
        timeout: getTutorsCanceler.promise
      }).success(function (data, status, headers, config) {
        //console.log('success');
        if (status == 200) deferred.resolve(data);
      }).error(function (data, status, headers, config){
        //console.log('error');
        deferred.reject('Can not get search result');
      });
      return deferred.promise;
    };

    return {
      getRecommendedTutors : getRecommendedTutors,
      getTutorsByLocation : getTutorsByLocation,
      getTutorsByQuery: getTutorsByQuery
    }




  }];
});
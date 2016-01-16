'use strict';

var utility = require('../../helpers/utility');

var getTutorsCanceler;

module.exports = ['$q', '$http', function ($q, $http) {

  var getRecommendedTutors = function () {

    var deferred = $q.defer();
    var url = utility.generateQueryUrl('recommend');

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    });

    return deferred.promise;
  };

  /**
   * Get location autocomplete
   * @param location
   */
  var getLocations = function(location) {
    var deferred = $q.defer();
    var url = utility.generateQueryUrl('suggest/location?q=' + location);

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    });

    return deferred.promise;
  };

  var getTutorsByQuery = function (query) {
    if (getTutorsCanceler) getTutorsCanceler.resolve();
    getTutorsCanceler = $q.defer();
    var deferred = $q.defer();
    var url = utility.generateQueryUrl('search');
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

  /**
   * Get a tutor details by id
   * @param id
   */
  var getTutorById = function(id) {
    var deferred = $q.defer();
    var url = utility.generateQueryUrl('tutor/' + id);

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    }, function(response) {
      deferred.resolve({'error': 'Invalid tutor Id'})
    });

    return deferred.promise;
  };

  var sendMessage = function(data) {
    var deferred = $q.defer();
    var url = 'http://localhost:8080/messages';

    $http({
      method : 'POST',
      url : url,
      data : data
    }).then(function (response) {
      deferred.resolve(response.data)
    });

    return deferred.promise;
  };


  var getMessages = function(tutor_id) {
    var deferred = $q.defer();
    var url = 'http://localhost:8080/messages';

    $http.get(url, {params: {receiver : tutor_id }})
      .then(function(response) {
        deferred.resolve(response.data);
      });


    return deferred.promise;
  };

  var deleteMessages = function (messageIds) {
    var deferred = $q.defer();
    var url = 'http://localhost:8080/messages';

    $http.delete(url, {params: {messageIds: messageIds}})
      .then(function(response) {
        deferred.resolve(response.data)
      });

    return deferred.promise;
  };

  return {
    getRecommendedTutors : getRecommendedTutors,
    getLocations : getLocations,
    getTutorsByQuery: getTutorsByQuery,
    getTutorById : getTutorById,
    sendMessage : sendMessage,
    getMessages : getMessages,
    deleteMessages : deleteMessages
  }
}];
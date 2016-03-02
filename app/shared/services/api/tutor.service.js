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

  var getSubjects = function(subject) {
    var deferred = $q.defer();
    var url = utility.generateQueryUrl('suggest/subject?q=' + subject);

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
    if (query.locationid) {
      //use locationid
      url += '&locationid=' + query.locationid;
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
    var url = utility.generateQueryUrl('tutors/' + id);

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    }, function(response) {
      deferred.resolve({'error': 'Invalid tutor Id'})
    });

    return deferred.promise;
  };

  var sendMessage = function(data) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('enquiries');

    $http({
      method : 'POST',
      url : url,
      data : data
    }).then(function (response) {
      deferred.resolve({success: 'Your enquiry has been sent to the tutor'})
    });

    return deferred.promise;
  };


  var getMessages = function() {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/me/enquiries');

    $http.get(url)
      .then(function(response) {
        deferred.resolve(response.data);
      });


    return deferred.promise;
  };

  var deleteMessages = function (messageIds) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/me/enquiries');

    $http.delete(url, {params: {ids: messageIds}})
      .then(function(response) {
        deferred.resolve({success: 'Enquiry deleted'})
      });

    return deferred.promise;
  };


  /**
   * Get Tutor profile
   *
   * @returns {*}
   */
  var getTutorProfile = function() {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/me/tutor');

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    }, function(error) {
      deferred.resolve({error: 'Please update your profile'});
    });

    return deferred.promise;
  };

  var updateTutorProfile = function(tutor) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('users/me/tutor');

    $http({
      method : 'POST',
      url : url,
      data : tutor
    }).then(function(response) {
      deferred.resolve({success : 'Profile updated'});
    });

    return deferred.promise;
  };

  var sendFeedback = function(feedback) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('feedback');

    $http({
      method : 'POST',
      url: url,
      data: feedback
    }).then(function(response) {
      deferred.resolve({success: 'Feedback sent'})
    });

    return deferred.promise;
  };

  var claimTutor = function(tutor) {
    var deferred = $q.defer();
    var url = utility.generateApiUrl('tutors/claim');

    $http({
      method: 'POST',
      url: url,
      data: tutor
    }).then(function(response) {
      deferred.resolve(response.data);
    },function(response) {
      if (response.status == 401) {
        deferred.resolve({error: 'Tutor details incorrect'})
      };

      if (response.status == 500) {
        deferred.resolve({error: 'System error, please try again'})
      };

    });

    return deferred.promise;
  };

  return {
    getRecommendedTutors : getRecommendedTutors,
    getLocations : getLocations,
    getSubjects : getSubjects,
    getTutorsByQuery: getTutorsByQuery,
    getTutorById : getTutorById,
    sendMessage : sendMessage,
    getMessages : getMessages,
    deleteMessages : deleteMessages,
    getTutorProfile : getTutorProfile,
    updateTutorProfile : updateTutorProfile,
    sendFeedback : sendFeedback,
    claimTutor : claimTutor
  }
}];
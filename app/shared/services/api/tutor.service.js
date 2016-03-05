'use strict';

var config = require('../../../app.constant');

var getTutorsCanceler;

module.exports = ['$q', '$http', 'TestService', function ($q, $http, TestService) {

  var getRecommendedTutors = function () {

    var deferred = $q.defer();
    var url = config.TUTOR_QUERY + 'recommend';

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
    var url = config.TUTOR_QUERY + 'suggest/location?q=' + location;

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    });

    return deferred.promise;
  };

  var getSubjects = function(subject) {
    var deferred = $q.defer();
    var url = config.TUTOR_QUERY + 'suggest/subject?q=' + subject;

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    });

    return deferred.promise;
  };

  var getTutorsByQuery = function (query) {
    if (getTutorsCanceler) getTutorsCanceler.resolve();
    getTutorsCanceler = $q.defer();
    var deferred = $q.defer();
    var url = config.TUTOR_QUERY + 'search';
    
    if (query.subjectids && query.subjectids.length) {
      if (typeof query.subjectids === 'string') {
        url += '?subjectids=' + query.subjectids
      } else {
        url += ('?subjectids=' + _.map(query.subjectids, function(x) { return 'subjectids=' + x; }).join('&'))
      }
    } else {
      url += '?keywords=' + query.keywords;
    }
    
    if (query.locationid) {
      url += '&locationid=' + query.locationid;
    } else {
      url += '&location=' + query.location;
    }
    
    if (query.gender) {
      url += '&gender=' + query.gender
    }
    
    var test = TestService.getTest();
    if (test) {
      url += '&test=' + test
    }
    
    url += '&page=' + query.page + '&pagesize=' + query.pageSize;

    $http({
      method: 'GET',
      url: url,
      timeout: getTutorsCanceler.promise
    }).success(function (data, status, headers, config) {
      if (status == 200) deferred.resolve(data);
    }).error(function (data, status, headers, config){
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
    var url = config.TUTOR_QUERY + 'tutors/' + id;

    $http.get(url).then(function(response) {
      var tutor = response.data;
      tutor.subjects = _.map(tutor.subjects, function(x) { return x.text }).join(', ');
      tutor.locations = _.map(tutor.locations, function(x) { return x.text }).join(', ');
      deferred.resolve(tutor);
    }, function(response) {
      deferred.resolve({'error': 'Invalid tutor Id'})
    });

    return deferred.promise;
  };

  var sendMessage = function(data) {
    var deferred = $q.defer();
    var url = config.TUTOR_API + 'enquiries';

    $http({
      method : 'POST',
      url : url,
      data : data
    }).then(function (response) {
      deferred.resolve({success: 'Your enquiry has been sent.'})
    });

    return deferred.promise;
  };


  var getMessages = function() {
    var deferred = $q.defer();
    var url = config.TUTOR_API + 'users/me/enquiries';

    $http.get(url)
      .then(function(response) {
        deferred.resolve(response.data);
      });


    return deferred.promise;
  };

  var deleteMessages = function (messageIds) {
    var deferred = $q.defer();
    var url = config.TUTOR_API + 'users/me/enquiries';

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
    var url = config.TUTOR_API + 'users/me/tutor';

    $http.get(url).then(function(response) {
      deferred.resolve(response.data);
    }, function(error) {
      deferred.resolve({error: 'Please update your profile'});
    });

    return deferred.promise;
  };

  var updateTutorProfile = function(tutor) {
    var deferred = $q.defer();
    var url = config.TUTOR_API + 'users/me/tutor';

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
    var url = config.TUTOR_API + 'feedback';

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
    var url = config.TUTOR_API + 'tutors/claim';

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
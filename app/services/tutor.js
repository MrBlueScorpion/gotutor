'use strict';

var config = require('../app.constant');

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

  var getTutorById = function(id) {
    var url = config.TUTOR_QUERY + 'tutors/' + id;

    return $http.get(url).then(function(response) {
      var tutor = response.data;
      tutor.subjects = _.map(tutor.subjects, function(x) { return x.text }).join(', ');
      tutor.locations = _.map(tutor.locations, function(x) { return x.text }).join(', ');
      return tutor;
    }, function() {
      return $q.reject('Cannot find tutor')
    });
  };

  var getTutorPhone = function(id) {
    var url = config.TUTOR_QUERY + 'tutors/' + id + '/phone';

    return $http.get(url).then(function(response) {
      return response.data.phone;
    }, function() {
      return $q.reject('Server error, please try again')
    });
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
    var url = config.TUTOR_API + 'users/me/tutor';

    return $http.get(url).then(function(res) {
      return res.data;
    }, function(e) {
      return $q.reject(e.status == 404 ? 
      'Please complete your tutor profile.' : 
      'Failed to retrieve your details, please try again')
    });
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
    var url = config.TUTOR_API + 'tutors/claim';

    return $http({
      method: 'POST',
      url: url,
      data: tutor
    }).then(function(response) {
      return response.data;
    }, function(response) {
      return $q.reject(response.status == 401 ? 'Incorrect tutor details.' : 'System error, please try again')
    });
  };

  return {
    getRecommendedTutors : getRecommendedTutors,
    getLocations : getLocations,
    getSubjects : getSubjects,
    getTutorsByQuery: getTutorsByQuery,
    getTutorById : getTutorById,
    getTutorPhone : getTutorPhone,
    sendMessage : sendMessage,
    getMessages : getMessages,
    deleteMessages : deleteMessages,
    getTutorProfile : getTutorProfile,
    updateTutorProfile : updateTutorProfile,
    sendFeedback : sendFeedback,
    claimTutor : claimTutor
  }
}];
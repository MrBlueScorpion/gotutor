'use strict';

module.exports = ['$scope', 'TutorApiService', 'toastr', '$http', '$state',
  function($scope, TutorApiService, toastr, $http, $state){

  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocations = function(location) {
    return TutorApiService.getLocations(location).then(function(locations) {
      return locations;
    })
  };

  $scope.getSubjects = function(subject) {
    return TutorApiService.getSubjects(subject).then(function(subjects) {
      return subjects
    })
  };

  $scope.searchTutors = function() {
    var query = {};

    if (angular.isDefined($scope.location)) {
      if (angular.isObject($scope.location)) {
        query.geohash = $scope.location.geohash;
      } else {
        query.location = $scope.location;
      }
    }

    if (angular.isDefined($scope.subject)) {
      if (angular.isObject($scope.subject)) {
        query.subjectids = $scope.subject.id;
        query.subject = $scope.subject.text;
      } else {
        query.subject = $scope.subject;
      }
    }
    console.log(query);

      //location: $scope.location,
      //locationIds: $scope.location.id

    $state.go('tutors', query);
  }

}];

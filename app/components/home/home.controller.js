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
    var query = {
     // geohash: $scope.location.geohash,
      //location: $scope.location,
      subject: $scope.subject
    };
    console.log(query);
    $state.go('tutors', query);
  }

}];

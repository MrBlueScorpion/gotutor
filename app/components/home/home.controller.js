'use strict';

module.exports = ['$scope', 'TutorApiService', 'toastr', '$http', function($scope, TutorApiService, toastr, $http){

/*    TutorApiService.getRecommendedTutors().then(function(data){
    $scope.tutors = data;

    $scope.subjects = _.keys(data);
    console.log(_.keys(data));
  });*/

  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(location) {
    TutorApiService.getLocations(location).then(function(response) {
      console.log(response);
      $scope.locations = response
    })
  };

}];

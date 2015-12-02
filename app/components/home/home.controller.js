'use strict';

module.exports = ['$scope', 'TutorApiService', 'toastr', '$http', function($scope, TutorApiService, toastr, $http){

/*    TutorApiService.getRecommendedTutors().then(function(data){
    $scope.tutors = data;

    $scope.subjects = _.keys(data);
    console.log(_.keys(data));
  });*/

  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };

}];

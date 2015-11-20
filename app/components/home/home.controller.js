'use strict';

define(function(require) {

  return ['$scope', 'TutorApiService', 'toastr', function($scope, TutorApiService, toastr){

/*    TutorApiService.getRecommendedTutors().then(function(data){
      $scope.tutors = data;

      $scope.subjects = _.keys(data);
      console.log(_.keys(data));
    });*/

    toastr.success('success', 'Toast is working');

  }];

});

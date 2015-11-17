'use strict';

define(function(require) {

  return ['$scope', 'TutorApiService', function($scope, TutorApiService){

    TutorApiService.getRecommendedTutors().then(function(data){
      $scope.tutors = data;

      $scope.subjects = _.keys(data);
      console.log(_.keys(data));
    });



  }];

});

module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', function($scope, $stateParams, tutorId, TutorApiService) {
  console.log($stateParams.tutorId);
  console.log(tutorId);

  TutorApiService.getTutorById(tutorId).then(function(response) {

    $scope.tutor = response;
    console.log($scope.tutor);
  });


}];

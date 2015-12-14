module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr',
  function($scope, $stateParams, tutorId, TutorApiService, toastr) {
  console.log($stateParams.tutorId);

  TutorApiService.getTutorById(tutorId).then(function(tutor) {

    $scope.tutor = tutor;
    console.log($scope.tutor);
  });


  $scope.sendMessage = function (message) {
    message.receiver = {id: tutorId};
    TutorApiService.sendMessage(message).then(function(response) {
      if (!_.isUndefined(response.success)) {
        toastr.success(response.success)
      }
    });
  }


}];

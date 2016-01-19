module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {

  TutorApiService.getTutorById(tutorId).then(function(tutor) {
    if (!_.isUndefined(tutor.error)) {
      $state.go('tutors');
    } else {
      $scope.tutor = tutor;
    }

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

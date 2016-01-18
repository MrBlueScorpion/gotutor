module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {



  TutorApiService.getTutorById(tutorId).then(function(response) {
    if (!_.isUndefined(response.error)) {
      $state.go('tutors');
    } else {
      $scope.tutor = response;
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
